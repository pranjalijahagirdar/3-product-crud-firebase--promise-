const cl=console.log;

const productForm =  document.getElementById('productForm')
const titleControl = document.getElementById('titleControl')
const priceControl = document.getElementById('priceControl')
const brandControl = document.getElementById('brandControl')
const categoryControl = document.getElementById('categoryControl')
const addproductBtn = document.getElementById('addproductBtn')
const updateprodutBtn = document.getElementById('updateprodutBtn')
const productContainer = document.getElementById('productContainer')
const spinner = document.getElementById('spinner')

const BASE_URL = `https://crud-6b7ce-default-rtdb.firebaseio.com`
const PRODUCTS_URL = `${BASE_URL}/products.json`

function snackbar(msg, icon){
    Swal .fire({
        title:msg,
        icon:icon,
        timer:3000
    })
}

function showSpinner(){
    spinner.classList.remove('d-none')
}
function hideSpinner(){
    spinner.classList.add('d-none')
}

const state = {
    productArr:[],
    editId:null,
}

//read

function oncreateProductList(arr){
    let result = ``;
    arr.forEach(ele=>{
        result += `<tr id="${ele.id}">
                                <td>${ele.brand}</td>
                                <td>${ele.category}</td>
                                <td>${ele.price}</td>
                                <td>${ele.title}</td>
                                <td class="text-center">
                                    <button onclick="editProduct(this)" class="btn btn-sm btn-info" role="button">EDIT</button>
                                </td>
                                <td class="text-center">
                                    <button onclick="deleteProduct(this)" class="btn btn-sm btn-danger" role="button">REMOVE</button>
                                </td>
                            </tr>`
    })
    productContainer.innerHTML = result;
}

function productFetch(){
    showSpinner()
    fetch(PRODUCTS_URL,{
        method:"GET",
        body:null,
        headers:{
            "Content-type":"application/json",
            "Authorization":"TOKEN JWT form LS",
        }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error()
        }
        return res.json()
    })
    .then(data=>{
        for(const key in data){
            data[key].id = key
            state.productArr.unshift(data[key])
        }
        oncreateProductList(state.productArr)
    })
    .catch(err=>{
        snackbar(err, 'error')
    })
    .finally(()=>{
        hideSpinner()
    })
}
productFetch()

//create

    function onAddProduct(eve){
        eve.preventDefault()
        let productObj={
            brand:brandControl.value,
            category:categoryControl.value,
            price:priceControl.value,
            title:titleControl.value,
        }
        showSpinner()
        fetch(PRODUCTS_URL,{
            method:"POST",
            body:JSON.stringify(productObj),
            headers:{
            "Content-type":"application/json",
            "Authorization":"TOKEN JWT form LS",
            }
        })
        .then(res=>{
            if(!res.ok){
                throw new Error()
            }
            return res.json()
        })
        .then(data=>{
            productObj.id = data.name
            state.productArr.unshift(productObj)
            productForm.reset()
            let tr = document.createElement('tr')
            tr.id = productObj.id;
            tr.innerHTML = ` <td>${productObj.brand}</td>
                                <td>${productObj.category}</td>
                                <td>${productObj.price}</td>
                                <td>${productObj.title}</td>
                                <td class="text-center">
                                    <button onclick="editProduct(this)" class="btn btn-sm btn-info" role="button">EDIT</button>
                                </td>
                                <td class="text-center">
                                    <button onclick="deleteProduct(this)" class="btn btn-sm btn-danger" role="button">REMOVE</button>
                                </td>`

            productContainer.prepend(tr)
            snackbar('Product card added successfully !!!', 'success')
        })
        .catch(err=>{
            snackbar(err, 'error')
        })
        .finally(()=>{
            hideSpinner()
        })
    }

    //delete 

    function deleteProduct(ele){
        let removeId =  ele.closest('tr').id;
        let REMOVE_URL = `${BASE_URL}/products/${removeId}.json`;
        Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    showSpinner()
    fetch(REMOVE_URL,{
        method:"DELETE",
        body:null,
        headers:{
            "Content-type":"application/json",
            "Authorization":"TOKEN JWT form LS",
        }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error()
        }
    })
    .then(data=>{
        let getIndex = state.productArr.findIndex(d=>d.id === removeId)
        state.productArr.splice(getIndex, 1)
        let tr = document.getElementById(removeId)
        ele.closest('tr').remove()
        snackbar('card deleted successfully !!!', 'success')
    })
    .catch(err=>{
        snackbar(err, 'error')
    })
    .finally(()=>{
        hideSpinner()
    })
  }
    })
}

//edit

function editProduct(ele){
    let editId = ele.closest('tr').id;
    state.editId = editId;
    let EDIT_URL = `${BASE_URL}/products/${editId}.json`;
    showSpinner()
    fetch(EDIT_URL,{
        method:"GET",
        body:null,
        headers:{
            "Content-type":"application/json",
            "Authorization":"TOKEN JWT form LS",
        }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error()
        }
        return res.json()
    })
    .then(res=>{
        brandControl.value = res.brand;
        categoryControl.value = res.category;
        priceControl.value = res.price;
        titleControl.value = res.title;
        addproductBtn.classList.add('d-none')
        updateprodutBtn.classList.remove('d-none')
    })
    .catch(err=>{
        snackbar(err,'error')
    })
    .finally(()=>{
        hideSpinner()
    })
}

//update 

function onUpdateProduct(){
    let updateId = state.editId;
    let UPDATE_URL = `${BASE_URL}/products/${updateId}.json`;
    let updateObj={
        brand:brandControl.value,
            category:categoryControl.value,
            price:priceControl.value,
            title:titleControl.value,
            id:updateId
    }
    showSpinner()
    fetch(UPDATE_URL,{
        method:"PATCH",
        body:JSON.stringify(updateObj),
        headers:{
            "Content-type":"application/json",
            "Authorization":"TOKEN JWT form LS",
        }
    })
    .then(res=>{
        if(!res.ok){
            throw new Error()
        }
        return res.json()
    })
    .then(data=>{
        let getIndex = state.productArr.findIndex(s=>s.id === updateId)
        state.productArr[getIndex]=updateObj;
        let tr = document.getElementById(updateId);
        tr.innerHTML = `<td>${updateObj.brand}</td>
                                <td>${updateObj.category}</td>
                                <td>${updateObj.price}</td>
                                <td>${updateObj.title}</td>
                                <td class="text-center">
                                    <button onclick="editProduct(this)" class="btn btn-sm btn-info" role="button">EDIT</button>
                                </td>
                                <td class="text-center">
                                    <button onclick="deleteProduct(this)" class="btn btn-sm btn-danger" role="button">REMOVE</button>
                                </td>`

                                productForm.reset()
                                addproductBtn.classList.remove('d-none')
                                 updateprodutBtn.classList.add('d-none')
                                 snackbar(`The card with ${updateId} is updated successfully !!!`,'success')
    })
    .catch(err=>{
        snackbar(err, 'error')
    })
    .finally(()=>{
        hideSpinner()
    })
}

productForm.addEventListener('submit', onAddProduct)
updateprodutBtn.addEventListener('click', onUpdateProduct)