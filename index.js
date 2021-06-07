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

    if (users.length === 0) {
      console.log(
        chalk.red.bold('\tERROR!!!') + ' Sorry, we could not find your account'
      );
      return;
    } else {
      const [user] = users;
      let { ID, name, pass, bal } = user;
      bal = parseInt(bal, 10);

      // =========================== Withdraw/Deposit ===========================
      inquirer
        .prompt([
          {
            type: 'list',
            message: `\nHello ${chalk.cyan.bold(
              name
            )}, your account balance is ${chalk.cyan.bold(
              'Ksh.' + bal
            )}. ${chalk.bold.bgMagenta('\n\nWhat do you want to do?')}`,
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
              amount = parseInt(amount, 10);
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
                  // =========================== Update new balance ===========================
                  user.bal = bal;
                }
              }, 1000);
            });
        });
    }
  });

const options = {
  Deposit: chalk.blue.bold('\tDepositing amount. Please wait...'),
  Withdraw: chalk.blue.bold('\tWithdrawing amount. Please wait...'),
};

transact = (transactType) => {
  const transaction = options[transactType];
  console.log(transaction);
};

// continueTransaction = () => {};
// quitTransaction = () => {};
