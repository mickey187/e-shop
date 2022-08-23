$('#addEmployeeBtn').click(function (e) { 

if ($('#addEmployeeForm').valid()) {
    var employeeFirstName = $('#employeeFirstName').val().trim();
    var employeeLastName = $('#employeeLastName').val().trim();
    var employeeUsername = $('#employeeUsername').val().trim();
    var employeeEmail = $('#employeeEmail').val().trim();
    var employeeRole = $('#employeeRole').val().trim();
    var epmloyeePassword = $('#epmloyeePassword').val().trim();
    var epmloyeeConfirmPassword = $('#epmloyeeConfirmPassword').val().trim();

    $.ajax({
        type: "POST",
        url: "/system-admin/employee/addEmployee",
        data: {
            employeeFirstName: employeeFirstName,
            employeeLastName: employeeLastName,
            employeeUsername: employeeUsername,
            employeeEmail: employeeEmail,
            employeeRole: employeeRole,
            epmloyeePassword: epmloyeePassword,
            epmloyeeConfirmPassword: epmloyeeConfirmPassword
        },
        dataType: "json",
        success: function (response) {
            console.log(response);
            if (response.status == "success") {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Employee Added Successfully!',
                  });
            }
        }, error: function(error){
            Swal.fire({
                icon: 'error',
                title: "Error",
                text: error.responseJSON.message
              });

        }
    });
} else {
    
}
    
});


$('#view_employee_tab_link').click(function (e) { 
    e.preventDefault();
    
    $.ajax({
        type: "GET",
        url: "/system-admin/employee/viewEmployee",
        data: "data",
        dataType: "json",
        success: function (data) {
            console.log(data);
            data.forEach(element => {
                Object.assign(element, {
                action: '<button type="button" class="btn btn-primary btn-sm btn-success" data-toggle="modal" data-target="#view_product_detail" data-whatever="@mdo"><i class="fas fa-info-circle"></i></button>'+' '+
                '<button type="button" class="btn btn-primary btn-sm btn-info"><i class="fas fa-edit"></i></button>'+' '+
                '<button type="button" class="btn btn-primary btn-sm btn-danger"><i class="fa fa-trash" aria-hidden="true"></i></button>'
            });
            });
            
            $("#viewEmployeeDatailTable").DataTable({
                // "processing": true,
                // "serverSide": true,
                // "ajax":"/finance/showStudentsRegsiteredForTransport",
                "destroy":true,
                "data":data,
                "columns": [
                    // { "data": "_id" },
                    { "data": "firstName" },
                    { "data": "lastName" },
                    {"data": "username"},
                    {"data": "email"},
                    {"data": "role"},
                    {"data": "action"}
                    // {"data": "createdAt"},
                    // {"data": "updatedAt"}

                   
                    
                   
                ],
                "responsive": true,
                "lengthChange": false,
                "autoWidth": false,
                "ordering": false,
                "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
            }).buttons().container().appendTo('#view_product_attribute_table_wrapper .col-md-6:eq(0)');
        }
    });
    
});