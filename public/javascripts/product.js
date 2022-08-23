


var imgArray = [];
var imgArrayProductCategory = [];


jQuery(document).ready(function () {
  ImgUpload();
  ImgUploadProductCategory();
});

function ImgUploadProductCategory() {
  var imgWrap = "";
  // var imgArray = [];

  $('.upload__inputfile_product_category_image').each(function () {
    $(this).on('change', function (e) {
      imgWrap = $(this).closest('.upload__box_product_category_image').find('.upload__img-wrap_product_category_image');
      var maxLength = $(this).attr('data-max_length');

      var files = e.target.files;
      var filesArr = Array.prototype.slice.call(files);
      var iterator = 0;
      filesArr.forEach(function (f, index) {

        if (!f.type.match('image.*')) {
          return;
        }

        if (imgArrayProductCategory.length > maxLength) {
          return false
        } else {
          var len = 0;
          for (var i = 0; i < imgArrayProductCategory.length; i++) {
            if (imgArrayProductCategory[i] !== undefined) {
              len++;
            }
          }
          if (len > maxLength) {
            return false;
          } else {
            imgArrayProductCategory.push(f);

            var reader = new FileReader();
            reader.onload = function (e) {
              var html = "<div class='upload__img-box_product_category_image'><div style='background-image: url(" + e.target.result + ")' data-number='" + $(".upload__img-close").length + "' data-file='" + f.name + "' class='img-bg'><div class='upload__img-close'></div></div></div>";
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
    for (var i = 0; i < imgArrayProductCategory.length; i++) {
      if (imgArrayProductCategory[i].name === file) {
        imgArrayProductCategory.splice(i, 1);
        break;
      }
    }
    $(this).parent().parent().remove();
  });
}

$('#addProductCategoryBtn').click(function (e) { 
    console.log(imgArrayProductCategory);

    if ($('#categoryForm').valid()) {

    
    var productCategory = $('#productCategory').val().trim();
    var productSubCategory = $('#productSubCategory').val().trim();

    var productCategoryFormData = new FormData();
    productCategoryFormData.append('productCategory', productCategory);
    productCategoryFormData.append('productSubCategory', productSubCategory);

    for (var i = 0; i < imgArrayProductCategory.length; i++) {
      productCategoryFormData.append('productCategoryImageUpload[]', imgArrayProductCategory[i]);
    }


      console.log("it validated");
      $.ajax({
        type: "POST",
        url: "/products/add-product-category",
        processData: false,
        contentType: false,
        data: productCategoryFormData,
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
            
            
        },crossDomain: true,
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



$('.show-category-detail').click(function () { 
  // e.preventDefault();
  console.log("hello");
});

$('#view_product_category_tab_link').click(function () { 

    $.ajax({
        type: "GET",
        url: "/products/view-product-category",
        // cache: false,
        dataType: "json",
        success: function (data) {
            console.log(data);
            data.forEach(element=>{
            //   var jsonStr = JSON.stringify(element);
             console.log(element._id);
              Object.assign(element,
    
                {action: '<button type="button" id="'+element._id+'" class="btn btn-primary btn-sm btn-success show-category-detail" data-toggle="modal" data-target="#view_product_detail"'+
                 'data-id="'+element._id+'" data-category="'+element.category+'" data-sub_category="'+element.subCategory+'" data-detail="'+JSON.stringify(element)+'"><i class="fas fa-info-circle"></i></button>'+' '+
                                       '<button type="button" class="btn btn-primary btn-sm btn-info" data-toggle="modal" data-target="#editCategoryModal" data-category_id_edit="'+element._id+'" data-category_edit="'+element.category+'" data-sub_category_edit="'+element.subCategory+'">'+
                                       '<i class="fas fa-edit"></i></button>'+' '+
                                       '<button type="button" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#deleteCategoryModal" data-category_id_delete="'+element._id+'" data-category_delete="'+element.category+'" data-sub_category_delete="'+element.subCategory+'">'+
                                       '<i class="fa fa-trash" aria-hidden="true"></i></button>'
                                      })
            });
            $("#view_product_category_table").DataTable({
                // "processing": true,
                // "serverSide": true,
                // "ajax":"/finance/showStudentsRegsiteredForTransport",
                "destroy":true,
                "data":data,
                "columns": [
                    { "data": "_id" },
                    { "data": "category" },
                    { "data": "subCategory" },
                    { "data": "action"}
                   
                    
                   
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

  
  if ($('#productAttributeForm').valid()) {
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
  } 
   
    
    

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
    
    

    console.log("thissssssssss",product_attribute_list);
    var form = $('#addProductForm');
    console.log("is form valid", form.valid());
    if (form.valid()) {
      var product_name = $('#product_name').val().trim();
    var product_price = $('#product_price').val().trim();
    var product_quantity = $('#product_quantity').val().trim();
    var product_category_list = $('#product_category_list').val();
    var product_attribute_list = $('#product_attribute_list').val();
    var tags_input = $('#tags_input').val().trim();
    var product_description = $('#product_description').val().trim();

        var productFormData = new FormData();
    productFormData.append('product_name', product_name);
    productFormData.append('product_price', product_price);
    productFormData.append('product_quantity', product_quantity);
    productFormData.append('product_category_list', product_category_list);
    productFormData.append('product_attribute_list', product_attribute_list);
    productFormData.append('tags_input', tags_input);
    productFormData.append('product_description', product_description);

        for (var i = 0; i < imgArray.length; i++) {
      productFormData.append('product_image_upload[]', imgArray[i]);
    }
    console.log(productFormData);
    


    // productFormData.append('product_image_upload', imgArray);



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
      crossDomain: true,
      error: function(err){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add product please try again!',
        
        });
      }
    });
    
  } else {
      
  }
});

$('#view_product_tab_link').click(function (e) { 
  e.preventDefault();
  $.ajax({
    type: "GET",
    url: "/products/view-product",
    // data: "data",
    dataType: "json",
    success: function (data) {
      
      var row = '';
      
       data.forEach(element => {
       
        for (let index = 0; index < element.attributes.length; index++) {
        //  console.log(JSON.stringify(element));
          Object.assign(element, {image: '<img src="'+element.images[0]+'" alt="..." class="img-thumbnail" style="width:100px;height: 100px">' });
          Object.assign(element,
            {action: '<button type="button" class="btn btn-primary btn-sm btn-success" data-toggle="modal" data-target="#" data-whatever="@mdo"><i class="fas fa-info-circle"></i></button>'+' '+
                                   '<button type="button" class="btn btn-primary btn-sm btn-info" data-toggle="modal" data-target="#editProductModal" data-product_id_edit="'+element._id+'"><i class="fas fa-edit"></i></button>'+' '+
                                   '<button type="button" class="btn btn-primary btn-sm btn-danger"><i class="fa fa-trash" aria-hidden="true"></i></button>'
                                  })
          
          
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























function ImgUploadProductCategory() {
  var imgWrap = "";
  // var imgArray = [];

  $('.upload__inputfile_product_category_image').each(function () {
    $(this).on('change', function (e) {
      imgWrap = $(this).closest('.upload__box_product_category_image').find('.upload__img-wrap_product_category_image');
      var maxLength = $(this).attr('data-max_length');

      var files = e.target.files;
      var filesArr = Array.prototype.slice.call(files);
      var iterator = 0;
      filesArr.forEach(function (f, index) {

        if (!f.type.match('image.*')) {
          return;
        }

        if (imgArrayProductCategory.length > maxLength) {
          return false
        } else {
          var len = 0;
          for (var i = 0; i < imgArrayProductCategory.length; i++) {
            if (imgArrayProductCategory[i] !== undefined) {
              len++;
            }
          }
          if (len > maxLength) {
            return false;
          } else {
            imgArrayProductCategory.push(f);

            var reader = new FileReader();
            reader.onload = function (e) {
              var html = "<div class='upload__img-box_product_category_image'><div style='background-image: url(" + e.target.result + ")' data-number='" + $(".upload__img-close").length + "' data-file='" + f.name + "' class='img-bg'><div class='upload__img-close'></div></div></div>";
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
    for (var i = 0; i < imgArrayProductCategory.length; i++) {
      if (imgArrayProductCategory[i].name === file) {
        imgArrayProductCategory.splice(i, 1);
        break;
      }
    }
    $(this).parent().parent().remove();
  });
}




function showCategoryDetail(e){
  var id = '#'+ e.toString();
  var categoryDetail = $("#"+e).data('categoryDetail');
  console.log("detail", categoryDetail);
  $(id).click(function (e) { 
    e.preventDefault();
    console.log("clicked");
    
  });
 
}

// $('#view_product_detail').on('show.bs.modal', function (event) {
//   var button = $(event.relatedTarget).attr('data-categoryDetail') // Button that triggered the modal
//   // var recipient = button.data('categoryDetail')
//   console.log(button._id);
//   $('#categoryId').text(button._id);
//   $('#subCategory').text(button.subCategory);
//   $('#category').text(button.category);
//   // var modal = $(this)
//   // modal.find('.modal-title').text('New message to ' + recipient)
//   // modal.find('.modal-body input').val(recipient)
// })

$('#view_product_detail').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal

  var categoryId = button.data('id'); 
  var category = button.data('category');
  var subCategory = button.data('sub_category');
  var detail = button.data('detail');
  console.log(categoryId +' '+category +' '+subCategory);
  $('#categoryId').text("Category ID: "+categoryId);
  $('#category').text("Category: "+category);
  $('#subCategory').text("Sub Category: "+subCategory);


  // var modal = $(this)
  // modal.find('.modal-title').text('New message to ' + recipient)
  // modal.find('.modal-body input').val(recipient)
});

$('#editCategoryModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var categoryId = button.data('category_id_edit'); // Extract info from data-* attributes
  var category = button.data('category_edit');
  var subCategory = button.data('sub_category_edit');
  console.log(category +' '+ subCategory );
  console.log(button);
  $('#categoryIdEdit_p').val(categoryId);
  $('#category_edit_input').val(category);
  $('#sub_category_edit_input').val(subCategory);

  
});

$('#edit_category_btn').click(function (e) { 
  e.preventDefault();
  if ($('#edit_category_form').valid()) {
    var categoryId = $('#categoryIdEdit_p').val();
    var category = $('#category_edit_input').val().trim();
    var subCategory = $('#sub_category_edit_input').val().trim();

    $.ajax({
      type: "POST",
      url: "/products/edit-product-category",
      data: {categoryId: categoryId, category: category, subCategory: subCategory},
      dataType: "json",
      success: function (data) {
        if (data.message == "updated") {
          console.log("success");
          $('#view_product_category_tab_link').click()
          $('#editCategoryModal').modal('hide')
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Updated Successfully!',
          
          });
        } else {
          
        }
      }
    });
  }
  else{
    console.log($('#edit_category_form').valid());
  }
});

$('#deleteCategoryModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var categoryId = button.data('category_id_delete') // Extract info from data-* attributes
  var category = button.data('category_delete');
  var subCategory = button.data('sub_category_delete');

  $('#category_id_p_del').val(categoryId);
  $('#category_p_del').text("Category: "+category);
  $('#sub_category_p_del').text("Sub Category: "+subCategory);

});

$('#delete_category_btn').click(function (e) { 
  e.preventDefault();
  console.log("delete");
  var categoryId = $('#category_id_p_del').val();
  $.ajax({
    type: "POST",
    url: "/products/delete-product-category",
    data: {categoryId: categoryId},
    dataType: "json",
    success: function (data) {
     
      if (data.message == "deleted") {

        $('#view_product_category_tab_link').click();
          $('#deleteCategoryModal').modal('hide');

        Swal.fire({
          icon: 'danger',
          title: 'Delete',
          text: 'One item deleted!',
        
        });
      } else {
        Swal.fire({
          icon: 'danger',
          title: 'Delete',
          text: 'Item could not be deleted please try again',
        
        });
      }
    }
  });
  
});

// edit produc modal
$('#editProductModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) 
  var productData = button.data('product_id_edit');
  console.log(productData);
  $.ajax({
    type: "GET",
    url: "/products/fetch-product-by-id/"+productData,
    dataType: "json",
    success: function (data) {
      console.log(data);
      if (data.status) {
        console.log(data.product.tags); 
        $('#product_name_edit').val(data.product.name);
        $('#product_price_edit').val(parseFloat(data.product.price.$numberDecimal));
        $('#product_quantity_edit').val(data.product.quantity);
        $('#product_description_edit').val(data.product.description);

        $('#product_category_edit').append(`<option value="${data.product._id}" selected>
                                       ${data.product.category.category} - ${data.product.category.subCategory}
                                  </option>`);
        
        data.product.attributes.forEach(element=>{
          $('#product_attribute_list_edit').append(`<option value="${element._id}" selected>
                                       ${element.attributeName} - ${element.value}
                                  </option>`);
        });

        data.product.productAttibute.forEach(element=>{
          $('#product_attribute_list_edit').append(`<option value="${element._id}" selected>
                                       ${element.attributeName} - ${element.value}
                                  </option>`)
        });
        var tags_arr = [];
        for (let index = 0; index < data.product.tags.length; index++) {
          var element = {"value": data.product.tags[index]}
          tags_arr.push(element);
        }
        $('#tags_input_edit').val("one");
        $('#product_name_edit').val(data.product.name);
      } else {
        
      }
      
    }
  });

  
})


