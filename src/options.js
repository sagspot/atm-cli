const depositTransaction = 'Depositing';

const options = {
  //   Deposit: 'Depositing. Please wait...',
  Deposit: depositTransaction,
  Withdraw: 'Withdrawing. Please wait...',
};

module.exports = transact = ({ transactType }) => {
  const transaction = options[transactType];
  console.log(transaction);
  console.log(bal);
};
