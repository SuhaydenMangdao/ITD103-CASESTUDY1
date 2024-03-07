import React from "react";
import { Progress } from "antd"; /* fetch a dataviz type from antd*/
const Analytics = ({ allTransaction }) => {
  // category
  const categories = [
    "food",
    "medical",
    "rent",
    "bills",
    "insurance",
    "salary",
    "tuition",
    "furniture",
    "subscriptions",
    "electronics",
    "travel",
  ];

  //total transaction
  const totalTransaction = allTransaction.length;
  const totalIncomeTransaction = allTransaction.filter(
    (transaction) => transaction.type === "income"
  );
  const totalExpenseTransaction = allTransaction.filter(
    (transaction) => transaction.type === "expense"
  );
  const totalIncomePercent =
    (totalIncomeTransaction.length / totalTransaction) * 100;
  const totalExpensePercent =
    (totalExpenseTransaction.length / totalTransaction) * 100;

  //total turnover
  const totalTurnover = allTransaction.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalIncomeTurnover = allTransaction
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpenseTurnover = allTransaction
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalIncomeTurnoverPercent =
    (totalIncomeTurnover / totalTurnover) * 100;
  const totalExpenseTurnoverPercent =
    (totalExpenseTurnover / totalTurnover) * 100;

  return (
    <>
      <div className="row m-3">
  <div className="col-md-3">
    <div className="card">
      <div className="card-header">
        TOTAL TRANSACTIONS: {totalTransaction}
      </div>
      <div className="card-body">
        <h5 className="text-success">
          Income: {totalIncomeTransaction.length}
        </h5>
        <h5 className="text-danger">
          Expense: {totalExpenseTransaction.length}
        </h5>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Progress // fetch a dataviz type from antd
          type="circle"
          strokeColor={"green"}
          className="mx-2"
          percent={totalIncomePercent.toFixed(0)}
        />
        <Progress // fetch a dataviz type from antd
          type="circle"
          strokeColor={"red"}
          className="mx-2"
          percent={totalExpensePercent.toFixed(0)}
        />
      </div>
    </div>
  </div>

  <div className="col-md-3">
    <div className="card">
      <div className="card-header">Total Turnover: ₱{totalTurnover} </div>
      <div className="card-body">
        <h5 className="text-success ">Income: ₱{totalIncomeTurnover}</h5>
        <h5 className="text-danger">Expense: ₱{totalExpenseTurnover}</h5>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Progress // fetch a dataviz type from antd
          type="circle"
          strokeColor={"green"}
          className="mx-2"
          percent={totalIncomeTurnoverPercent.toFixed(0)}
        />
        <Progress // fetch a dataviz type from antd
          type="circle"
          strokeColor={"red"}
          className="mx-2"
          percent={totalExpenseTurnoverPercent.toFixed(0)}
        />
      </div>
    </div>
  </div>

  <div className="col-md-2">
    <h4>Income Summary</h4>
    {categories.map((category) => {
      const amount = allTransaction
        .filter(
          (transaction) =>
            transaction.type === "income" &&
            transaction.category === category
        )
        .reduce((acc, transaction) => acc + transaction.amount, 0);
      return (
        amount > 0 && (
          <div className="card" key={category}>
            <div className="card-body">
              <h5>{category}</h5>
              <Progress
                percent={((amount / totalIncomeTurnover) * 100).toFixed(0)}
              />
            </div>
          </div>
        )
      );
    })}
  </div>

  <div className="col-md-2">
    <h4>Expenses Summary</h4>
    {categories.map((category) => {
      const amount = allTransaction
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.category === category
        )
        .reduce((acc, transaction) => acc + transaction.amount, 0);
      return (
        amount > 0 && (
          <div className="card">
            <div className="card-body" key={category}>
              <h5>{category}</h5>
              <Progress
                percent={((amount / totalExpenseTurnover) * 100).toFixed(0)}
              />
            </div>
          </div>
        )
      );
    })}
  </div>
</div>

    </>
  );
};

export default Analytics;
