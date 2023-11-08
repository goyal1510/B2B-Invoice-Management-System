package com.highradius.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.highradius.implementation.InvoiceDao;
import com.highradius.implementation.InvoiceDaoImpl;
import com.highradius.model.Invoice;

/**
 * Servlet implementation class Search_customerid
 */
@WebServlet("/search_customerid")
public class Search_customerid extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
	static final String DB_URL = "jdbc:mysql://localhost:3306/h2h";
	// Database credentials
	static final String USER = "root";
	static final String PASS = "jayant#1510";

	private InvoiceDao invoices;
    /**
     * Default constructor. 
     */
	public void init() {
		invoices = new InvoiceDaoImpl();
	}
    /**
     * @see HttpServlet#HttpServlet()
     */


	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
		// TODO Auto-generated method stub
		protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
			// TODO Auto-generated method stub
			try {
				HashMap<Object,Object> Rsp = new HashMap<>();
				List<Invoice> data = new ArrayList<>();
				String cust_order_id1 = request.getParameter("cust_order_id");
				Class.forName("com.mysql.cj.jdbc.Driver");
				Connection conn = DriverManager.getConnection(DB_URL,USER,PASS);
				String fetch_data_search = "select Sl_no,CUSTOMER_ORDER_ID, SALES_ORG, DISTRIBUTION_CHANNEL, CUSTOMER_NUMBER, COMPANY_CODE, ORDER_CURRENCY, AMOUNT_IN_USD, ORDER_CREATION_DATE from h2h_oap where CUSTOMER_ORDER_ID LIKE CONCAT(?,'%') limit 5000;";
				PreparedStatement ps=conn.prepareStatement(fetch_data_search);
				
				ps.setString(1, cust_order_id1);
				ResultSet rs = ps.executeQuery();
				while(rs.next()) {
					String id = rs.getString("Sl_no");
					String cust_order_id = rs.getString("CUSTOMER_ORDER_ID");
					String sales_org = rs.getString("SALES_ORG");
					String distr_channel = rs.getString("DISTRIBUTION_CHANNEL");
					String cust_number = rs.getString("CUSTOMER_NUMBER");
					String ccode = rs.getString("COMPANY_CODE");
					String curr_type = rs.getString("ORDER_CURRENCY");
					String usd_amount = rs.getString("AMOUNT_IN_USD");
					String order_creation = rs.getString("ORDER_CREATION_DATE");
					data.add(new Invoice(id, cust_order_id, sales_org, distr_channel, cust_number, ccode, curr_type,  usd_amount, order_creation));
					}
				Rsp.put("customer",data);
				Gson gson = new Gson();
				String json = gson.toJson(Rsp);
				response.setHeader("Access-Control-Allow-Origin", "*");
				response.getWriter().append(json);
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
			
			
			
			
			
		}

	

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
