﻿//init
$(document).ready(function () {
    BuildStudents();
    $('select#insert_authors').on("change", function () { console.log($('#' + this.id).val()) })
    $('#insert_request').click(InsertBook);
});
function InsertBook() {
    data = {
        type: 'insert',
        tid: $('#insert_tid').val(),
        title: $('#insert_title').val(),
        itype: $('#insert_type').val(),
        price: $('#insert_price').val(),
        authors: $('#insert_authors').val()
    }
    AjaxRequest('service.php', 'POST', data, 'json', (data) => {

        console.log(data);

    }, function (request, status, error) { console.log(request, "break", status, "break", error); });
}
//authors = [];
function BuildStudents() {
    //init request using names iun textboxes, updates grid accordingly
    AjaxRequest('https://localhost:60796/students', 'GET', {}, 'JSON', (data) => {
        
        console.log(data);
        console.log("why?");
        table = '<table id="students"><tr><th> Get Student </th><th> Student Id </th><th> First Name </th><th> Last Name </th><th> School Id </th><th>Actions</th></tr>';
        options = '';
        for (row of data) {
            table += '<tr><td><button class="retrieve" id="' + row.sId + '">Retrieve Class Info</button></td>';
            table += '<td>';
            table += row.sId;
            table += '</td>';
            table += '<td id='+row.sId+' class="fname">';
            table += row.fName;
            table += '</td>';
            table += '<td id='+row.sId+' class="lname">';
            table += row.lName;
            table += '</td>';
            table += '<td id=' + row.sId +' class="schoolid">';
            table += row.schoolId;
            table += '</td>';
            table += "<td><button id='" + row.sId + "' class='delete'>Delete</button><button id='" + row.sId + "' class='edit'>Edit</button></td>";
        }
        table += "</table><p id='studentstatus'> Retrieved: " + data.length + " student records </p>";
        $('#main')[0].innerHTML = table;
        $(".retrieve").click(BuildTitles);
        $(".delete").click(Delete);
        $(".edit").click(Edit);
    }, function (request, status, error) { console.log(request, "break", status, "break", error); });
}
function BuildTitles() {
    console.log(this.id);
    AjaxRequest('https://localhost:60796/classes', 'POST', {student_id: $(this.id)}, 'json', (data) => {
        console.log(data);
        if ($("table")[1]) {
            $("table")[1].remove();
        }
        if (data.length > 0) {

            table = '<table><tbody id="titles"><tr><th>Class Id</th><th>Class Desc</th><th>Days</th><th>Start Date</th><th>Instructor Id</th><th>Instructor First Name</th><th>Instructor Last Name</th></tr>';
            i = 0;
            for (row of data) {
                i++;
                console.log(row);
                table += '<td id="' + row.title_id + '_tid">';
                table += row.cId;
                table += '</td>';
                table += '<td>';
                table += row.desc;
                table += '</td>';
                table += '<td>';
                table += (row.days =="[object Object]")?0:row.days;
                table += '</td>';
                table += '<td>';
                table += row.sDate;
                table += '</td>';
                table += '<td>';
                table += row.iId;
                table += '</td>';
                table += '<td>';
                table += row.fName;
                table += '</td>';
                table += '<td>';
                table += row.lName;
                table += '</td>';
                table += '</td></tr>';

            }
            if ($("#titles")[0] == null) {
                table += "</tbody></table>";
                $('#main')[0].innerHTML += table;
            }
            else {
                console.log(table);
                $('#titles')[0].innerHTML += table;
            }
            console.log(data);
            console.log(table);
        }

        response = "Retrieved: " + data.length + " title records";
        $("#titlestatus").remove();
        $('#main')[0].innerHTML += "<p id='titlestatus'></p>";
        $('#titlestatus')[0].innerHTML = response;
        $(".retrieve").click(BuildTitles);
        for (row of data) {
            console.log('#' + row.title_id + '_edit');
            $('#' + row.title_id + '_edit').click(Edit);
            $('#' + row.title_id + '_delete').click(Delete);
        }
    }, function (request, status, error) { console.log(request, "break", status, "break", error); });
}
function Delete() {
    console.log(this.id);
    AjaxRequest("https://localhost:60796/delete", "POST", { student_id: this.id },'JSON', (data) => { console.log(data); $("#main").html($("#main").html() + "Changed" +1 + "Rows") }, function (request, status, error) { console.log(request, "break", status, "break", error); });
}
function Edit() {
    console.log(this.id);
    if ($("input").length > 0) BreakEdit();
    $("#" + this.id + ".fname").html("<input type='text' placeholder='" + $("#" + this.id + ".fname").html() + "' value='" + $("#" + this.id + ".fname").html() +"'></input>");
    $("#" + this.id + ".lname").html("<input type='text' placeholder='" + $("#" + this.id + ".lname").html() + "' value='" + $("#" + this.id + ".lname").html() + "'></input>");
    $("#" + this.id + ".schoolid").html("<input type='text' placeholder='" + $("#" + this.id + ".schoolid").html() + "' value='" + $("#" + this.id + ".schoolid").html() + "'></input>");
    $("#" + this.id + ".delete").html("Update");
    $("#" + this.id + ".edit").html("Cancel");
    $("#" + this.id + ".delete").off("click");
    $("#" + this.id + ".edit").off("click");
    $("#" + this.id + ".delete").click(Update);
    $("#" + this.id + ".edit").click(BreakEdit);
}
function BreakEdit() {
    id = $("input").parent().attr('id');
    $("#" + id + ".fname").html($("#" + id + ".fname").children().val());
    $("#" + id + ".lname").html($("#" + id + ".lname").children().val());
    $("#" + id + ".schoolid").html($("#" + id + ".schoolid").children().val());
    $("#" + id + ".delete").html("Delete");
    $("#" + id + ".edit").html("Edit");
    $("#" + id + ".delete").off("click");
    $("#" + id + ".edit").off("click");
    $("#" + id + ".delete").click(Delete);
    $("#" + id + ".edit").click(Edit);
}
function Update() {
    id = this.id;
    console.log(id);
    AjaxRequest("https://localhost:60796/update", "POST", {
        student_id: id,
        fname: $("#" + id + ".fname").children().val(),
        lname: $("#" + id + ".lname").children().val(),
        schoolid: $("#" + id + ".schoolid").children().val()
    }, 'JSON',
        (data) => {
            console.log(data);
            $("#main").html($("#main").html() + "Changed" + 1 + "Rows")
        },
        function (request, status, error) { console.log(request, "break", status, "break", error); });
}
/*
* AjaxRequest(url, method, data, datatype, success, error)
* Param url(target url)
* Param method(GET or POST)
* Param data(input data)
* Param datatype(data return type)
* Param success(success callback)
* Param error(error callback)
* Purpose: Executes ajax request given options
*/
function AjaxRequest(url, method, data, datatype, success, error) {
    var options = {};
    options['url'] = url;
    options['method'] = method;
    options['data'] = JSON.stringify(data);
    options['dataType'] = datatype;
    options["success"] = success;
    options["error"] = error;
    options['contentType'] = "application/json";
    $.ajax(options);
}