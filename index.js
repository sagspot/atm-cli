#!/usr/bin/env node

const inquirer = require('inquirer');
const boxen = require('boxen');
const chalk = require('chalk');
const userCredentials = [
  { ID: 1, username: 'sags', fName: 'Oliver', password: '1234', balance: 2000 },
  { ID: 2, username: 'ace', fName: 'James', password: '0000', balance: 1500 },
  { ID: 3, username: 'jane', fName: 'Jane', password: '1212', balance: 5000 },
];

const userLogin = {
  type: 'input',
  name: 'username',
  message: 'Enter your username:',
};
const userPassword = {
  type: 'password',
  name: 'password',
  message: 'Enter your password',
  mask: '*',
};
const transactions = {
  type: 'list',
  name: 'transaction',
  message: 'What would you like to do?',
  choices: ['Check balance', 'Deposit', 'Withdraw'],
};
const continueTransaction = {
  type: 'list',
  name: 'proceed',
  message: 'Would you like to continue?',
  choices: ['Yes', 'No'],
};
const deposit = {
  type: 'input',
  name: 'deposit',
  message: 'Enter amount to deposit',
};
const withdraw = {
  type: 'input',
  name: 'withdraw',
  message: 'Enter amount to withdraw',
};

checkUsername = () => {
  inquirer.prompt(userLogin).then(({ username }) => {
    const users = userCredentials.filter((user) => {
      if (username == user.username) {
        return user;
      }
    });
    if (users.length === 0) {
      console.log(`\n\t${chalk.red('Account not found')}. Try again\n`);
      checkUsername();
      return;
    }
    console.log(chalk.green('\n\tSuccess!\n'));
    checkPassword(users);
  });
};

checkPassword = ([users]) => {
  inquirer.prompt(userPassword).then(({ password }) => {
    if (password == users.password) {
      console.log(chalk.green('\n\tSuccess!\n'));
      setTimeout(() => {
        console.log(
          `\tWelcome to our bank ${users.fName}, you have Ksh.${users.balance} in your account\n`
        );
        transact(users);
      }, 500);
      return;
    }
    console.log(
      `\n\t${chalk.red(
        'Incorrect password'
      )}. Enter your username and try again\n`
    );

    checkUsername();
  });
};

transact = (users) => {
  inquirer.prompt(transactions).then(({ transaction }) => {
    if (transaction == 'Deposit') {
      depositTransaction(users);
      return;
    }
    if (transaction == 'Withdraw') {
      withdrawTransaction(users);
      return;
    }
    checkBalance(users);
  });
};

checkBalance = (users) => {
  console.log(chalk.blue('\n\tChecking balance. Please wait...\n'));
  setTimeout(() => {
    console.log(
      boxen(
        `${chalk.green.bold(
          'Transaction successful!'
        )}\n\nYour account balance is Ksh.${users.balance}`,
        { padding: 1 }
      )
    );
    transactionContinue(users);
  }, 1500);
};

depositTransaction = (users) => {
  let { balance } = users;
  inquirer.prompt(deposit).then(({ deposit }) => {
    deposit = parseInt(deposit, 10);
    balance += deposit;
    console.log(chalk.blue('\n\tDepositing amount. Please wait...\n'));
    setTimeout(() => {
      console.log(
        boxen(
          `${chalk.green.bold(
            'Transaction successful!'
          )}\n\nKsh.${deposit} has been deposited to your account. Current balance is Ksh.${balance}`,
          { padding: 1 }
        )
      );
      users.balance = balance;
      transactionContinue(users);
    }, 1500);
  });
};

withdrawTransaction = (users) => {
  let { balance } = users;
  inquirer.prompt(withdraw).then(({ withdraw }) => {
    withdraw = parseInt(withdraw, 10);
    console.log(chalk.blue('\n\tWithdrawing amount. Please wait...\n'));
    setTimeout(() => {
      if (withdraw > balance) {
        console.log(
          boxen(
            `${chalk.bold.red(
              'Transaction failed!'
            )}\n\nYou do not have enough money to withdraw Ksh.${withdraw}. Current balance is Ksh.${balance}`,
            { padding: 1 }
          )
        );
        withdrawTransaction(users);
        return;
      }
      balance -= withdraw;
      console.log(
        boxen(
          `${chalk.green.bold(
            'Transaction successful!'
          )}\n\nKsh.${withdraw} has been withdrawn from your account. Current balance is Ksh.${balance}`,
          { padding: 1 }
        )
      );
      users.balance = balance;
      transactionContinue(users);
    }, 1500);
  });
};

transactionContinue = (users) => {
  inquirer.prompt(continueTransaction).then(({ proceed }) => {
    if (proceed === 'Yes') transact(users);
    else quitTransaction();
  });
};

quitTransaction = () => {
  console.log(chalk.cyan.bold(`\n\tThank you for banking with us. Goodbye`));
};

checkUsername();
