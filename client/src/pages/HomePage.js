import React, { useState, useEffect } from "react";
import {
  Input,
  Modal,
  message,
  Form,
  Select,
  Table,
  DatePicker,
  Card,
} from "antd";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [allTransaction, setAllTransaction] = useState([]);
  const [filteredTransaction, setFilteredTransaction] = useState([]); // State for filtered transactions
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectDate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditTable] = useState(null);
  const [refreshPage, setRefreshPage] = useState(false); // State to trigger page refresh
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  //table data
  const columns = [
    {
      title: "Date (MM-DD-YY)",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("MM-DD-YY")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditTable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  //getall transactions
  //useEffect hook
  useEffect(() => {
    const getAllTransaction = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        let requestData = {
          userid: user._id,
          frequency,
          type,
        };
        if (frequency === "custom") {
          requestData.selectedDate = selectedDate;
        }
        const res = await axios.post(
          "http://localhost:8080/api/v1/transactions/get-transaction",
          requestData
        );
        setLoading(false);
        setAllTransaction(res.data);
        setFilteredTransaction(res.data);
      } catch (error) {
        console.log(selectedDate);
        message.error("Fetch issue with transaction");
      }
    };
    getAllTransaction();
  }, [frequency, selectedDate, type, refreshPage]);

  // Function to handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = allTransaction.filter((transaction) => {
      const { date, amount, type, category, reference } = transaction;
      const searchFields = [date, amount, type, category, reference].map(
        (field) => field.toString().toLowerCase()
      );
      return searchFields.some((field) => field.includes(query.toLowerCase()));
    });
    setFilteredTransaction(filtered);
  };

  //delete handler
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/v1/transactions/delete-transaction", {
        transactionId: record._id,
      });
      setLoading(false);
      message.success("Transaction Deleted");
      setRefreshPage((prevState) => !prevState);
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("unable to delete");
    }
  };

  //form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post("http://localhost:8080/api/v1/transactions/edit-transaction", {
          payload: {
            ...values,
            userId: user._id,
          },
          transactionId: editable._id,
        });
        setLoading(false);
        message.success("Transaction updated successfully");
        setRefreshPage((prevState) => !prevState);
      } else {
        await axios.post("http://localhost:8080/api/v1/transactions/add-transaction", {
          ...values,
          userid: user._id,
        });
        setLoading(false);
        message.success("Transaction added successfully");
        setRefreshPage((prevState) => !prevState);
      }
      setShowModal(false);
      setEditTable(null);
    } catch (error) {
      setLoading(false);
      message.error("Failed to add transaction");
    }
  };

  

  return (
    <Layout>
      {loading && <Spinner />}
      <Card>
        <div className="filters">
          <div className="filter-item">
            <h6>Select Frequency</h6>
            <Select
              value={frequency}
              onChange={(values) => setFrequency(values)}
            >
              <Select.Option value="7">Last 1 Week</Select.Option>
              <Select.Option value="30">Last 1 Month</Select.Option>
              <Select.Option value="365">Last 1 Year</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>
            {frequency === "custom" && (
              <RangePicker
                value={selectedDate}
                onChange={(values) => setSelectDate(values)}
              />
            )}
          </div>
          <div className="select-item">
            <h6>Select Type</h6>
            <Select
              value={type}
              onChange={(values) => setType(values)}
              className="custom-select" // Apply custom class to the Select component
            >
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </div>
          <div className="filter-item switch-icons">
            {/* ICONS HERE */}
            <UnorderedListOutlined
              className={`mx-2 ${
                viewData === "table" ? "active-icon" : "inactive-icon"
              }`}
              onClick={() => setViewData("table")}
            />
            <AreaChartOutlined
              className={`mx-2 ${
                viewData === "analytics" ? "active-icon" : "inactive-icon"
              }`}
              onClick={() => setViewData("analytics")}
            />
          </div>

          <div className="filter-item">
            <Input
              placeholder="Search Transactions"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              Add new
            </button>
          </div>
        </div>
      </Card>

      <h1 style={{ fontSize: "24px" }}>TRANSACTION HISTORY</h1>
      <div className="content">
        {viewData === "table" ? (
          <Table columns={columns} dataSource={filteredTransaction} />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>

      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editable ? editable : null}
          key={editable ? editable._id : "new"}
        >
          <Form.Item label="Amount" name="amount">
            <Input type="text" />
          </Form.Item>

          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="rent">Rent</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="insurance">Insurance</Select.Option>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tuition">Tuition</Select.Option>
              <Select.Option value="furniture">Furniture</Select.Option>
              <Select.Option value="subscriptions">Subscriptions</Select.Option>
              <Select.Option value="electronics">Electronics</Select.Option>
              <Select.Option value="travel">Travel</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Date" name="date">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              {""}Add
            </button>

          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
