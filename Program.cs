using Microsoft.Data.SqlClient;
using System.Text.Json.Nodes;

namespace CMarsh_ICA08
{
    record Id ( string student_id);
    record Student (string student_id, string fname, string lname, string schoolid);
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            // Without this your CORS services will fail upon attempted.

            var app = builder.Build();
            // need to fix CORS policy 
            // Will allow web service to be called from any website
            app.UseCors(x => x.AllowAnyMethod()
                             .AllowAnyHeader()
                             .SetIsOriginAllowed(origin => true));

            JsonArray j = new JsonArray();
            string connectionString = "Server=data.cnt.sast.ca,24680; Database=cmarsh7_ClassTrak; User Id=cmarsh7; Password = CNT_123; Encrypt = False";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {

                connection.Open();

                string query = "select * from Students where first_name like 'F%' or first_name like 'E%'";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    { // Process the results
                        while (reader.Read())
                        {
                            // Access data using reader["ColumnName"] or reader.GetXXX() methods
                            j.Add((object)new {
                                sId = reader["student_id"],
                                fName = reader["first_name"],
                                lName = reader["last_name"],
                                schoolId = reader["school_id"]
                            });

                        }
                    }
                }

            }
            app.MapGet("/students", () => { Console.WriteLine("why"); return j.ToJsonString(); });
            app.MapPost("/classes", (Id id) => {
                JsonArray y = new JsonArray();
                using (SqlConnection connection = new SqlConnection(connectionString))
                {

                    connection.Open();

                    string query = "select c.class_id, c.class_desc, c.days, c.start_date, c.instructor_id, i.first_name, i.last_name  from Classes c join class_to_student cs on cs.class_id=c.class_id join Instructors i on i.instructor_id=c.instructor_id where cs.student_id=" + id.student_id;
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        { // Process the results
                            while (reader.Read())
                            {
                                // Access data using reader["ColumnName"] or reader.GetXXX() methods
                                y.Add((object)new
                                {
                                    cId = reader["class_id"],
                                    desc = reader["class_desc"],
                                    days = reader["days"],
                                    sDate = reader["start_date"],
                                    iId = reader["instructor_id"],
                                    fName = reader["first_name"],
                                    lName = reader["last_name"]

                                });

                            }
                        }
                    }

                }
                return y.ToJsonString(); });
            app.MapPost("/delete", (Id id) => {
                Console.WriteLine(id);
                int rowsAffected;
                JsonArray y = new JsonArray();
                using (SqlConnection connection = new SqlConnection(connectionString))
                {

                    connection.Open();

                    string query = $"delete cs from Students s join class_to_student cs on cs.student_id=s.student_id where s.student_id={id.student_id};\r\ndelete r from Results r where r.student_id={id.student_id};\r\ndelete s from Students s where s.student_id={id.student_id};";
                    Console.WriteLine(query);
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        rowsAffected = command.ExecuteNonQuery();
                    }

                }

                return new { changed = rowsAffected };
            });
            app.MapPost("/update", (Student stu) => {
                Console.WriteLine(stu);
                int rowsAffected;
                JsonArray y = new JsonArray();
                /*using (SqlConnection connection = new SqlConnection(connectionString))
                {

                    connection.Open();
                    Console.WriteLine(query);
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        rowsAffected = command.ExecuteNonQuery();
                    }

                }

                return new { changed = rowsAffected };*/
                return new {a="hell0" };
            });
                app.Run();
        }
    }
}
