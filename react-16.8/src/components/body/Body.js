import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { TabContext, TabPanel } from "@material-ui/lab";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Button } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import Adddata from "../add_data/Adddata";
import { Box, TablePagination } from "@material-ui/core";
import { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import {
  getData,
  addCustomer,
  deleteCustomer,
  updateCustomer,
  searchCustomer,
} from "../dataaxios/DataAxios";
import DeleteButton from "../deletebuttton/DeleteButton";
import EditButton from "../editbutton/EditButton";

export default function Body() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [searched, setSearched] = React.useState();
  const [initial, setInitial] = useState([]);

  const [customer, setCustomer] = React.useState({
    id: "",
    cust_order_id: "",
    sales_org: "",
    distr_channel: "",
    cust_number: "",
    ccode: "",
    curr_type: "",
    usd_amount: "",
    order_creation: "",
  });
  const [customer1, setCustomer1] = React.useState({
    cust_order_id: "",
    sales_org: "",
    distr_channel: "",
    cust_number: "",
    ccode: "",
    curr_type: "",
    usd_amount: "",
    order_creation: "",
  });
  const [editCustomer, setEditCustomer] = React.useState({
    edit_id: "",
    edit_curr_type: "",
    edit_ccode: "",
    edit_distr_channel: "",
  });
  const {
    cust_order_id,
    sales_org,
    distr_channel,
    cust_number,
    ccode,
    curr_type,
    usd_amount,
    order_creation,
  } = customer1;

  const { edit_curr_type, edit_ccode, edit_distr_channel } = editCustomer;

  const handleRefresh = async () => {
    setData(await getData());
    setSearched("");
    setPage(0);
    setRowsPerPage(8);
    setSelected([]);
    cancelSearch();
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setCustomer1({ ...customer1, [name]: value });
  };

  const editChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditCustomer({ ...editCustomer, [name]: value });
  };

  const submitHandler = async (e) => {
    let response = await addCustomer(customer1);
    if (response) {
      setCustomer1({
        cust_order_id: "",
        sales_org: "",
        distr_channel: "",
        cust_number: "",
        ccode: "",
        curr_type: "",
        usd_amount: "",
        order_creation: "",
      });

      setData(await getData());
      setInitial(await getData());
      setTabValue("one");
      alert("1 Row sucessfully added");
    }
  };

  const deleteHandler = async () => {
    let i = 0,
      flag = 0,
      num = selected.length;
    while (selected.length > i) {
      let response = await deleteCustomer(selected[i++]);
      if (response) {
        flag = 1;
      }
    }
    if (num === 0) alert("No rows selected");
    if (flag) {
      setData(await getData());
      // setData1(await getData());
      setInitial(await getData());
      setSelected([]);
      if (num > 0) alert(num + " Row(s) sucessfully deleted");
    }
  };

  const openEdit = () => {
    if (selected.length === 1) {
      var editCustomer1 = data.filter((c) => c.id === selected[0])[0];
      setEditCustomer({
        edit_id: editCustomer1.id,
        edit_curr_type: editCustomer1.curr_type,
        edit_ccode: editCustomer1.ccode,
        edit_distr_channel: editCustomer1.distr_channel,
      });
    }
  };
  const editHandler = async () => {
    let response = await updateCustomer(editCustomer);
    if (response) {
      setData(await getData());
      // setData1(await getData());
      setInitial(await getData());
      alert("Row successfully edited");

      setEditCustomer({
        edit_id: "",
        edit_curr_type: "",
        edit_ccode: "",
        edit_distr_channel: "",
      });
      setSelected([]);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await getData();
      setInitial(await getData());
      setData(res);
      // setData1(res);
    })();
  }, []);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const [tabvalue, setTabValue] = React.useState("one");
  const [searval, setsearval] = React.useState(false);
  const [advancs, setadvancs] = React.useState(true);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const Sbar = () => {
    setsearval((searval) => {
      if (searval === false) {
        setTabValue("three");
      }
      return true;
    });
    setadvancs(false);
    // setData1(data1);
    setSearched("");
    setData(initial);
  };
  const clearbutton = () => {
    setadvancs(true);
    setsearval(false);
    setSearched("");
    setData(initial);
    setTabValue("one");
  };
  const addclearbutton1 = () => {
    setCustomer1({
      cust_order_id: "",
      sales_org: "",
      distr_channel: "",
      cust_number: "",
      ccode: "",
      curr_type: "",
      usd_amount: "",
      order_creation: "",
    });
  };

  const requestSearch = async (searchedVal) => {
    // Sbar();
    setTabValue("three");
    setadvancs(false);

    if (searchedVal === "" || searchedVal.length < 1) setData(initial);
    if (searchedVal.length >= 1) {
      let response = await searchCustomer(searchedVal);
      setData(response.customer);
    }
  };

  const cancelSearch = () => {
    setadvancs(true);
    setsearval(false);
    setSearched("");
    setData(initial);
    setTabValue("one");
  };

  return (
    <div style={{ backgroundColor: "#555", color: "#ffffff" }}>
      <SearchBar
        style={{}}
        onClick={Sbar}
        placeholder="Search Customer Id"
        value={searched}
        onChange={(searchVal) => requestSearch(searchVal)}
        onCancelSearch={() => cancelSearch()}
      />

      <TabContext value={tabvalue}>
        <Tabs value={tabvalue} onChange={handleChange}>
          <Tab label="Home Page" value={"one"} />
          <Tab label="Add Data" value={"two"} />
          {searval && <Tab label="Search Result" value={"three"} />}
          <Tab label="Analytics View" value={"four"} />

          {advancs && (
            <Button
              variant="contained"
              size="small"
              style={{
                margin: "0.25%",
                backgroundColor: "#8fd163",
                transform: "translateX(230%)",
              }}
            >
              Advance search
            </Button>
          )}
          {searval && (
            <Button
              variant="contained"
              size="small"
              style={{
                margin: "0.25%",
                backgroundColor: "#db4437",
                transform: "translateX(350%)",
              }}
              onClick={clearbutton}
            >
              Clear
            </Button>
          )}
        </Tabs>
        <TabPanel value={"one"} index={0}>
          <Box sx={{ width: "100%" }}>
            <TableContainer component={Paper}>
              <Table
                className="DataTable"
                sx={{ minWidth: 650 }}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow className="DataTableHeader">
                    <TableCell
                      padding="checkbox"
                      style={{
                        backgroundColor: "#555",
                        color: "white",
                      }}
                    >
                      <Checkbox
                        style={{ color: "white" }}
                        indeterminate={
                          selected.length > 0 && selected.length < data.length
                        }
                        checked={
                          data.length > 0 && selected.length === data.length
                        }
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      {" "}
                      Sl no.
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      Customer Order Id
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      {" "}
                      Sales Org
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      {" "}
                      Distribution Channel{" "}
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      Customer Number
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      Company Code
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      Order Currency
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      Amount In Usd
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      Order Creaton Date
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((customer) => (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, customer.id)}
                        role="checkbox"
                        aria-checked={isSelected(customer.id)}
                        tabIndex={-1}
                        selected={isSelected(customer.id)}
                        key={customer.id}
                        sx={{
                          "&:last-child TableCell, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        <TableCell
                          padding="checkbox"
                          style={{ backgroundColor: "#555" }}
                        >
                          <Checkbox
                            label="My checkbox"
                            labelStyle={{ color: "white" }}
                            iconStyle={{ fill: "white" }}
                            inputstyle={{ color: "white" }}
                            style={{ color: "white" }}
                            checked={isSelected(customer.id)}
                          />
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{ backgroundColor: "#555", color: "white" }}
                        >
                          {customer.id}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.cust_order_id}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.sales_org}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.distr_channel}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.cust_number}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.ccode}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.curr_type}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.usd_amount}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.order_creation}
                        </TableCell>
                      </TableRow>
                    ))}
                  {emptyRows > 0 && (
                    <TableRow>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[8, 15, 25, 50]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              style={{ color: "white" }}
            />
            <div
              style={{
                marginTop: "2%",
                transform: "translate(2%,-170%)",
                width: "50%",
              }}
            >
              <Button
                variant="contained"
                size="small"
                style={{ margin: "0.25%", backgroundColor: "#fc7500" }}
                onClick={handleRefresh}
              >
                <RefreshIcon />
                Refresh
              </Button>
              <EditButton
                edit_curr_type={edit_curr_type}
                edit_ccode={edit_ccode}
                edit_distr_channel={edit_distr_channel}
                openEdit={openEdit}
                editChangeHandler={editChangeHandler}
                editHandler={editHandler}
                num={selected.length}
              />

              <DeleteButton deleteHandler={deleteHandler} />

              <Button
                variant="contained"
                size="small"
                style={{ margin: "0.25%", backgroundColor: "#fc7500" }}
              >
                Predict
              </Button>
            </div>
          </Box>
        </TabPanel>
        <TabPanel value={"two"} index={1}>
          <Adddata
            cust_order_id={cust_order_id}
            sales_org={sales_org}
            distr_channel={distr_channel}
            cust_number={cust_number}
            ccode={ccode}
            curr_type={curr_type}
            usd_amount={usd_amount}
            order_creation={order_creation}
            changeHandler={changeHandler}
            submitHandler={submitHandler}
            addclearbutton1={addclearbutton1}
          />
        </TabPanel>
        <TabPanel value={"three"} index={2}>
          <Box sx={{ width: "100%" }}>
            <TableContainer component={Paper}>
              <Table
                className="DataTable"
                sx={{ minWidth: 650 }}
                size="small"
                aria-label="a dense table"
                style={{ width: "100%", height: "100%" }}
              >
                <TableHead>
                  <TableRow className="DataTableHeader">
                    <TableCell
                      padding="checkbox"
                      style={{
                        backgroundColor: "#555",
                        color: "white",
                      }}
                    >
                      <Checkbox
                        style={{ color: "white" }}
                        indeterminate={
                          selected.length > 0 && selected.length < data.length
                        }
                        checked={
                          data.length > 0 && selected.length === data.length
                        }
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      {" "}
                      Sl no.
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      Customer Order Id
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      {" "}
                      Sales Org
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      {" "}
                      Distribution Channel{" "}
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      Customer Number
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      Company Code
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      Order Currency
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      Amount In Usd
                    </TableCell>
                    <TableCell
                      align=" left"
                      style={{ backgroundColor: "#555", color: "white" }}
                    >
                      Order Creaton Date
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((customer) => (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, customer.id)}
                        role="checkbox"
                        aria-checked={isSelected(customer.id)}
                        tabIndex={-1}
                        selected={isSelected(customer.id)}
                        key={customer.id}
                        sx={{
                          "&:last-child TableCell, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        <TableCell
                          padding="checkbox"
                          style={{ backgroundColor: "#555" }}
                        >
                          <Checkbox
                            label="My checkbox"
                            labelStyle={{ color: "white" }}
                            iconStyle={{ fill: "white" }}
                            inputstyle={{ color: "white" }}
                            style={{ color: "white" }}
                            checked={isSelected(customer.id)}
                          />
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{ backgroundColor: "#555", color: "white" }}
                        >
                          {customer.id}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.cust_order_id}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.sales_org}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.distr_channel}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.cust_number}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.ccode}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.curr_type}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.usd_amount}
                        </TableCell>
                        <TableCell
                          padding="checkbox"
                          style={{
                            whiteSpace: "nowrap",
                            backgroundColor: "#555",
                            color: "white",
                          }}
                          align=" left"
                        >
                          {customer.order_creation}
                        </TableCell>
                      </TableRow>
                    ))}
                  {emptyRows > 0 && (
                    <TableRow>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[8, 15, 25, 50]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              style={{ color: "white" }}
            />
            <div
              style={{
                marginTop: "2%",
                transform: "translate(2%,-170%)",
                width: "50%",
              }}
            >
              <Button
                variant="contained"
                size="small"
                style={{ margin: "0.25%", backgroundColor: "#fc7500" }}
                onClick={handleRefresh}
              >
                <RefreshIcon />
                Refresh
              </Button>
              <EditButton
                edit_curr_type={edit_curr_type}
                edit_ccode={edit_ccode}
                edit_distr_channel={edit_distr_channel}
                openEdit={openEdit}
                editChangeHandler={editChangeHandler}
                editHandler={editHandler}
                num={selected.length}
              />

              <DeleteButton deleteHandler={deleteHandler} />

              <Button
                variant="contained"
                size="small"
                style={{ margin: "0.25%", backgroundColor: "#fc7500" }}
              >
                Predict
              </Button>
            </div>
          </Box>
        </TabPanel>
        <TabPanel value={"four"} index={2}>
          Item Four
        </TabPanel>
      </TabContext>
    </div>
  );
}
