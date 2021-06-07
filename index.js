const inquirer = require('inquirer');
const boxen = require('boxen');
const chalk = require('chalk');
const passwords = require('./src/users.json');

const requireNumber = (value) => {
  if (/^\d+$/.test(value)) return true;
  return 'MUST contain ONLY numbers';
};

// =========================== Enter password ===========================
inquirer
  .prompt([
    {
      type: 'password',
      message: 'Enter your password to proceed',
      name: 'password',
      mask: '*',
      validate: requireNumber,
    },
  ])
  .then(({ password }) => {
    const users = passwords.filter((user) => {
      if (password === user.pass) {
        return user;
      }
    });

    if (users.length === 0)
      console.log('Sorry, we could not find your account');
    else {
      const [user] = users;
      let { ID, name, pass, bal } = user;

      // =========================== Withdraw/Deposit ===========================
      inquirer
        .prompt([
          {
            type: 'list',
            message: `Hello ${chalk.cyan.bold(
              name
            )}, your account balance is ${chalk.cyan.bold(
              'Ksh.' + bal
            )}. What do you want to do?`,
            name: 'transactType',
            choices: ['Deposit', 'Withdraw'],
          },
        ])
        .then(({ transactType }) => {
          // =========================== Enter amount ===========================
          inquirer
            .prompt([
              {
                type: 'input',
                message:
                  transactType === 'Deposit'
                    ? 'Enter the amount you wish to deposit?'
                    : 'Enter the amount you wish to Withdraw?',
                name: 'amount',
                validate: requireNumber,
              },
            ])
            .then(({ amount }) => {
              // =========================== Transaction success/fail ===========================

              transact(transactType);
              setTimeout(() => {
                if (transactType === 'Withdraw' && amount > bal) {
                  console.log(
                    boxen(
                      `${chalk.red(
                        'Transaction failed.'
                      )} You have insufficient funds to withdraw Ksh.${amount}`,
                      { padding: 1 }
                    )
                  );
                } else {
                  transactType === 'Deposit'
                    ? (bal += amount)
                    : (bal -= amount);
                  console.log(
                    boxen(
                      `${chalk.green('Transaction Successful.')} You have ${
                        transactType === 'Deposit' ? 'deposited' : 'withdrawn'
                      } Ksh.${amount} and your current balance is ${bal}`,
                      { padding: 1 }
                    )
                  );
                }
              }, 2000);
            });
        });
    }
  });

const options = {
  Deposit: chalk.blue.bold('Depositing amount. Please wait...'),
  Withdraw: chalk.blue.bold('Withdrawing amount. Please wait...'),
};

transact = (transactType) => {
  const transaction = options[transactType];
  console.log(transaction);
};
