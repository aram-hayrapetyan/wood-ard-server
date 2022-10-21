import { Connection } from "typeorm";
import inquirer from "inquirer";
import { hash } from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

inquirer
    .prompt([
        {
            name: 'action',
            message: 'action [create (c), update (u)]:',
            validate: function(action) {
                const done = this.async();

                if (!['create', 'update', 'c', 'u'].includes(action)) {
                    done('Please provide on of this actions! [create, update]');
                }

                done(null, true);
            }
        },
        {
            name: 'email',
            validate: function(email) {
                const done = this.async();

                if (!email.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) {
                    done('Invalid email! Please provide a valid email!');
                }

                done(null, true);
            }
        },
        {
            type: 'password',
            mask: true,
            name: 'password',
            when: function(answers) {
                return answers.action === 'create' || answers.action === 'c';
            },
            validate: function (password) {
                const done = this.async();

                setTimeout(() => {
                    if (password.length < 6) {
                        done('Password is too short! Your password must contain 6 or more digits!');
                    }
                    if (!password.match(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)) {
                        done('Invalid password! Please make sure that your password contains letters and numbers!');
                    }
    
                    done(null, true);
                })
            }
        },
        {
            type: 'password',
            mask: true,
            name: 'password',
            when: function(answers) {
                return answers.action === 'update' || answers.action === 'u';
            },
            validate: function (password) {
                const done = this.async();

                setTimeout(() => {
                    if (password) {
                        if (password.length < 6) {
                            done('Password is too short! Your password must contain 6 or more digits!');
                        }
                        if (!password.match(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)) {
                            done('Invalid password! Please make sure that your password contains letters and numbers!');
                        }
                    }
    
                    done(null, true);
                })
            }
        },
        {
            name: 'first_name',
            when: function(answers) {
                return answers.action === 'create' || answers.action === 'c';
            },
            validate: function(first_name) {
                const done = this.async();

                setTimeout(() => {
                    if (first_name.length === 0) {
                        done('First name should not be empty!');
                    }
    
                    done(null, true);
                })
            }
        },
        {
            name: 'first_name',
            when: function(answers) {
                return answers.action === 'update' || answers.action === 'u';
            },
        },
        {
            name: 'last_name',
            when: function(answers) {
                return answers.action === 'create' || answers.action === 'c';
            },
            validate: function(last_name) {
                const done = this.async();

                setTimeout(() => {
                    if (last_name.length === 0) {
                        done('Last name should not be empty!');
                    }
    
                    done(null, true);
                })
            }
        },
        {
            name: 'last_name',
            when: function(answers) {
                return answers.action === 'update' || answers.action === 'u';
            },
        },
        {
            type: 'confirm',
            name: 'confirm',
        }
    ])
    .then(async (answers) => {
        if (answers.confirm) {
            const create = new Connection({
                "type": process.env.DB_TYPE,
                "host": process.env.DB_HOST,
                "port": process.env.DB_PORT,
                "username": process.env.DB_USER,
                "password": process.env.DB_PASSWORD,
                "database": process.env.DB_DATABASE
            });
            const connection = await create.connect();
            console.info(`<---------- Connected to ${process.env.DB_DATABASE} ---------->`)

            try {
                const admins = await connection.query(`SELECT * FROM user WHERE email='${answers.email}'`);
    
                let query = '';
    
                if (answers.password) answers.password = await hash(answers.password, 8);
                
                if (answers.action === 'create' || answers.action === 'c') {
                    answers.action = 'create';

                    if (admins.length) {
                        throw new Error(`Admin with email "${answers.email}" already exists! Please use another email!`);
                    }
    
                    query = `INSERT INTO user (email, password, first_name, last_name) values ('${answers.email}', '${answers.password}', '${answers.first_name}', '${answers.last_name}');`;
                }
                else if ((answers.action === 'update' || answers.action === 'u') && admins.length) {
                    answers.action = 'update';

                    let options = [
                        {key: 2, name: 'password', value: answers.password||admins[0].password},
                        {key: 3, name: 'first_name', value: answers.first_name||admins[0].first_name},
                        {key: 4, name: 'last_name', value: answers.last_name||admins[0].last_name},
                    ]
    
                    query = `UPDATE user SET ${options.map(op => `${op.name} = '${op.value}'`).join(', ')} WHERE id = ${admins[0].id};`;
                }
    
                if (query.length) {
                    const data = await connection.query(query);
                    const [ admin ] = await connection.query(`SELECT * FROM user WHERE id=${data.insertId||admins[0].id}`);

                    console.log(`Admin "${admin.first_name} ${admin.last_name}" with email "${admin.email}" is ${answers.action}d.`);
                }

                connection.close();
                console.info('<---------- Connection closed ---------->')
            } catch (err) {
                console.error(err);

                connection.close();
                console.info('<---------- Connection closed ---------->')
            }
        }
    })
    .catch((error) => {
        console.error(error);
    });