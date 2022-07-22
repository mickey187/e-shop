
var imgArray = [];

$('#addProductCategoryBtn').click(function (e) { 
    

    if ($('#categoryForm').valid()) {
    var productCategory = $('#productCategory').val().trim();
    var productSubCategory = $('#productSubCategory').val().trim();
      console.log("it validated");
      $.ajax({
        type: "POST",
        url: "/products/add-product-category",
        cache: false,
        data: {productCategory: productCategory, productSubCategory: productSubCategory},
        success: function (response) {
          console.log(response);
         if (response.message == 'success') {
          Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Added Successfully!',
              
              });
         }
         else{
          Swal.fire({
            icon: 'error',
            title: "Error",
            text: response.message
          })
         }
            
            
        },
        error: function(){
            console.error();
            Swal.fire({
              icon: 'error',
              title: "Error",
              text: "Could not complete task please try again"
            })
        }
    });

    }
    
    
    
});

$('#view_product_category_tab_link').click(function () { 

    $.ajax({
        type: "GET",
        url: "/products/view-product-category",
        // cache: false,
        dataType: "json",
        success: function (response) {
            console.log(response);
            $("#view_product_category_table").DataTable({
                // "processing": true,
                // "serverSide": true,
                // "ajax":"/finance/showStudentsRegsiteredForTransport",
                "destroy":true,
                "data":response,
                "columns": [
                    { "data": "_id" },
                    { "data": "category" },
                    { "data": "subCategory" },
                   
                    
                   
                ],
                "responsive": true,
                "lengthChange": false,
                "autoWidth": false,
                "ordering": false,
                "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
            }).buttons().container().appendTo('#view_product_category_table_wrapper .col-md-6:eq(0)');
        }
    });
});

$('#add_product_attribute_btn').click(function () { 

  
  // if ($('#productAttributeForm').valid()) {
    var product_attribute_name = $('#productAttributeName').val().trim();
    var product_attribute_value = $('#productAttributeValue').val().trim();
      $.ajax({
        type: "POST",
        url: "/products/add-product-attribute",
        cache: false,
        data: {productAttibuteName: product_attribute_name, productAttributeValue: product_attribute_value},
        // dataType: "json",
        success: function (response) {
          console.log(response);
            if(response.message == 'success'){
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Added Successfully!',
                  
                  });
            } else{
              Swal.fire({
                icon: 'error',
                title: "Error",
                text: response.message
              })
             }
            
        },
        error: function(){
            console.error();
            Swal.fire({
              icon: 'error',
              title: "Error",
              text: "Could not complete task please try again"
            })
        }
    });
  // } 
   
    
    

});

$('#view_product_attribute_tab_link').click(function () { 

    $.ajax({
        type: "GET",
        url: "/products/view-product-attribute",
        // data: "data",
        dataType: "json",
        success: function (response) {
            $("#view_product_attribute_table").DataTable({
                // "processing": true,
                // "serverSide": true,
                // "ajax":"/finance/showStudentsRegsiteredForTransport",
                "destroy":true,
                "data":response,
                "columns": [
                    { "data": "_id" },
                    { "data": "attributeName" },
                    { "data": "value" },
                   
                    
                   
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

$('#add_product_tab_link').click(function () { 

    $.ajax({
        type: "GET",
        url: "/products/fetch-product-category",
        // data: "data",
        dataType: "json",
        success: function (data) {
            console.log(data);
            data.forEach(element => {
                // console.log(element._id);
                $('#product_category_list').append(`<option value="${element._id}">
                                       ${element.category} - ${element.subCategory}
                                  </option>`);
            });
        }
    });

    $.ajax({
        type: "GET",
        url: "/products/fetch-product-attribute",
        // data: "data",
        dataType: "json",
        success: function (data) {
            data.forEach(element => {
                console.log("heyyyyyyyyyy",JSON.stringify(element._id));
                $('#product_attribute_list').append(`<option value="${element._id}">
                                       ${element.attributeName} - ${element.value}
                                  </option>`);
            });
        }
    });

   
});




jQuery(document).ready(function () {
    ImgUpload();
  });
  
  function ImgUpload() {
    var imgWrap = "";
    // var imgArray = [];
  
    $('.upload__inputfile').each(function () {
      $(this).on('change', function (e) {
        imgWrap = $(this).closest('.upload__box').find('.upload__img-wrap');
        var maxLength = $(this).attr('data-max_length');
  
        var files = e.target.files;
        var filesArr = Array.prototype.slice.call(files);
        var iterator = 0;
        filesArr.forEach(function (f, index) {
  
          if (!f.type.match('image.*')) {
            return;
          }
  
          if (imgArray.length > maxLength) {
            return false
          } else {
            var len = 0;
            for (var i = 0; i < imgArray.length; i++) {
              if (imgArray[i] !== undefined) {
                len++;
              }
            }
            if (len > maxLength) {
              return false;
            } else {
              imgArray.push(f);
  
              var reader = new FileReader();
              reader.onload = function (e) {
                var html = "<div class='upload__img-box'><div style='background-image: url(" + e.target.result + ")' data-number='" + $(".upload__img-close").length + "' data-file='" + f.name + "' class='img-bg'><div class='upload__img-close'></div></div></div>";
                imgWrap.append(html);
                iterator++;
              }
              reader.readAsDataURL(f);
            //   console.log(imgArray);
            }
          }
        });
      });
    });
  
    $('body').on('click', ".upload__img-close", function (e) {
      var file = $(this).parent().data("file");
      for (var i = 0; i < imgArray.length; i++) {
        if (imgArray[i].name === file) {
          imgArray.splice(i, 1);
          break;
        }
      }
      $(this).parent().parent().remove();
    });
  }

  
  $('#add_product_btn').click(function () { 
    
    // var files = $('#product_image_upload').files;
    ImgUpload();
    console.log(imgArray);
    
    var product_name = $('#product_name').val();
    var product_price = $('#product_price').val();
    var product_quantity = $('#product_quantity').val();
    var product_category_list = $('#product_category_list').val();
    var product_attribute_list = $('#product_attribute_list').val();
    var tags_input = $('#tags_input').val();
    var product_description = $('#product_description').val();

    console.log("thissssssssss",product_attribute_list);

    var productFormData = new FormData();
    productFormData.append('product_name', product_name);
    productFormData.append('product_price', product_price);
    productFormData.append('product_quantity', product_quantity);
    productFormData.append('product_category_list', product_category_list);
    productFormData.append('product_attribute_list', product_attribute_list);
    productFormData.append('tags_input', tags_input);
    productFormData.append('product_description', product_description);
    // productFormData.append('product_image_upload', imgArray);

    for (var i = 0; i < imgArray.length; i++) {
      productFormData.append('product_image_upload[]', imgArray[i]);
    }
    console.log(productFormData);

    $.ajax({
      type: "POST",
      url: "/products/add-product",
      data: productFormData,
      processData: false,
      contentType: false,
      // dataType: "dataType",
      success: function (data) {
        
        if (data == "success") {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Added Successfully!',
          
          });
        }
      },
      crossDomain: true
    });
    
    // var images = imgArray;

    // $.ajax({
    //     type: "POST",
    //     url: "/products/add-product",
    //     processData: false,
    //     contentType: false,
    //     data: {productName: product_name, productPrice: product_price, productQuantity: product_quantity,
    //     productCategoryList: product_category_list, productAttributeList: product_attribute_list,
    //     tagsInput: tags_input, productDescription: product_description, images: imgArray},
    //     dataType: "json",
    //     success: function (response) {
            
    //     }
    // });
    
});

$('#view_product_tab_link').click(function (e) { 
  e.preventDefault();
  $.ajax({
    type: "GET",
    url: "/products/view-product",
    // data: "data",
    dataType: "json",
    success: function (data) {
      console.log(data);
      var row = '';
      
       data.forEach(element => {
       
        for (let index = 0; index < element.attributes.length; index++) {
         
          Object.assign(element, {image: '<img src="/'+element.images[0]+'" alt="..." class="img-thumbnail" style="width:100px;height: 100px">' });
          Object.assign(element,
            {action: '<button type="button" class="btn btn-primary btn-sm btn-success" data-toggle="modal" data-target="#view_product_detail" data-whatever="@mdo"><i class="fas fa-info-circle"></i></button>'+' '+
                                   '<button type="button" class="btn btn-primary btn-sm btn-info"><i class="fas fa-edit"></i></button>'+' '+
                                   '<button type="button" class="btn btn-primary btn-sm btn-danger"><i class="fa fa-trash" aria-hidden="true"></i></button>'
                                  })
          console.log(element.attributes[index].attributeName);
          
        }
      
        
       });
      //  console.log("hhhhhhhh", data);
      $("#view_product_table").DataTable({
        // "processing": true,
        // "serverSide": true,
        // "ajax":"/finance/showStudentsRegsiteredForTransport",
        "destroy":true,
        "data":data,
        "columns": [
            // { "data": "_id" },
            { "data": "name" },
            { "data": "price.$numberDecimal" },
            { "data": "quantity"},
            // { "data": "description"},
            { "data": "category.category"},
            { "data": "category.subCategory"},
            // { "data": "tags"},
            { "data": "image"},
            { "data": "action"}
 
        ],
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "ordering": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
    }).buttons().container().appendTo('#view_product_table_wrapper .col-md-6:eq(0)');

      data.forEach(element => {
        
       

      //   row += 
      //   '<div class="p-2">'+
      //    '<div class="card" style="width: 18rem;">'+
      //   '<img class="card-img-top" src="..." alt="Card image cap">'+
      //   '<div class="card-body">'+
      //     '<h5 class="card-title">'+element.name+'</h5>'+
      //     '<p class="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.</p>'+
      //     '<a href="#" class="btn btn-primary">Go somewhere</a>'+
      //   '</div>'+
      // '</div>'+
      // '</div>'
      
      

      });

      $('#product_div').html(row);
    }
  });
  
});

$('#view_product_detail').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var recipient = button.data('whatever') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  modal.find('.modal-title').text('New message to ' + recipient)
  modal.find('.modal-body input').val(recipient)
})



