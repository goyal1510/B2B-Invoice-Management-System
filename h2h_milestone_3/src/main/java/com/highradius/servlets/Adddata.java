package com.highradius.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.HashMap;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.highradius.implementation.*;
import com.highradius.model.Invoice;

/**
 * Servlet implementation class Adddata
 */
@WebServlet("/Adddata")
public class Adddata extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
	static final String DB_URL = "jdbc:mysql://localhost:3306/h2h";
	// Database credentials
	static final String USER = "root";
	static final String PASS = "jayant#1510";

	
       
	private InvoiceDao invoices;
    
	public void init() {
		invoices = new InvoiceDaoImpl();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		 
//		Invoice invoice = new Invoice(cust_order_id, sales_org, distr_channel, cust_number , ccode, curr_type, usd_amount, order_creation);
//		try {
//			invoices.insertInvoice(invoice);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
		// TODO Auto-generated method stub
		try {
			
			HashMap<Object,Object> Rsp = new HashMap<>();
			
			String cust_order_id = request.getParameter("cust_order_id");
			 String sales_org = request.getParameter("sales_org");
			 String distr_channel = request.getParameter("distr_channel");
			 String cust_number = request.getParameter("cust_number");
			 String ccode = request.getParameter("ccode");
			 String curr_type = request.getParameter("curr_type");
			 String usd_amount = request.getParameter("usd_amount");
			 String order_creation = request.getParameter("order_creation");
			
			 
				Class.forName("com.mysql.cj.jdbc.Driver");
				Connection conn = DriverManager.getConnection(DB_URL,USER,PASS);
				
				String sql = "INSERT INTO h2h_oap" + " (CUSTOMER_ORDER_ID, SALES_ORG, DISTRIBUTION_CHANNEL, CUSTOMER_NUMBER, COMPANY_CODE, ORDER_CURRENCY, AMOUNT_IN_USD, ORDER_CREATION_DATE) VALUES " + " (?,?,?,?,?,?,?,?);";
				
				
				PreparedStatement ps=conn.prepareStatement(sql);
				
				ps.setString(1, cust_order_id);
				ps.setString(2, sales_org);
				ps.setString(3, distr_channel);
				ps.setString(4, cust_number);
				ps.setString(5, ccode);
				ps.setString(6, curr_type);
				ps.setString(7, usd_amount);
				ps.setString(8, order_creation);
				if(ps.executeUpdate()>0)
				{
					
					Rsp.put("update",true);
				}
				else
				{
					Rsp.put("update",false);
				}
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
		try {
			doPost(request,response);
		} catch (ServletException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
