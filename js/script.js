let array20 = [];
let singleMeal = {};

// *LOADER

$(window).ready(() => {
    $("#loading").fadeOut(700, function () {
        let typeOfFilter = "s";
        let searchby = "";
        fetchMeals(searchby, typeOfFilter);
    });
});

// *SIDEBAR

$(".toggleBtn").click(function () {
    $(".toggBtn").toggleClass("fa-bars fa-x");
    $("#side-menu").toggle(90);
    $(".itemLinks").toggleClass("linkshow");
    // new WOW().init();
});


$("#category").click(function () {
    fetchCategories();
});

$("#search").click(function () {
    searchPage();
});

$("#country").click(function () {
    fetchArea();
});

$("#ingr").click(function () {
    fetchIng();
});
$("#contact").click(function () {
    contactPage();
});

// !HOME
async function fetchMeals(searchby, typeOfFilter) {
    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?${typeOfFilter}=${searchby}`
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        var dataNew = data.meals;
        if (dataNew) {
            displayMeals(dataNew);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

const displayMeals = (dataArray) => {
    let cols = "";
    for (let i = 0; i < dataArray.length; i++) {
        if (i < 20) {
            cols += `
        <picture class="main-item col-md-3 position-relative">
            <img src="${dataArray[i].strMealThumb}" alt="meal" />
            <div class="layer">
                <h3 class="text-white">${dataArray[i].strMeal}</h3>
            </div>
        </picture>`;
        }
    }
    var searchDisplay = document.getElementById("searchwrapper");
    if (searchDisplay) {
        $(".searchDisplay").html(cols);
    } else {
        $(".meals").html(cols);
    }
    getMealName();
};

// !MEAL
const getMealName = () => {
    $(".layer").click(function () {
        let title = $(this).text().trim();
        let typeOfFilter = "s";
        fetchMeal(title, typeOfFilter);
    });
};

async function fetchMeal(title) {
    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${title}`
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        singleMeal = data.meals[0];
        displaySingleMeal(singleMeal);
    } catch (error) {
        console.error("Error:", error);
    }
}

const displaySingleMeal = () => {
    var tags = singleMeal.strTags;
    var tagString = "";
    if (tags) {
        tagString = `
        <p class="fa-2x">Tags :</p>
        <p class="tag btn btn-light">${tags}</p>`;
    }
    let meal = `
    <div class="container my-4 d-flex">
        <div class="mealimg me-2">
            <img src="${singleMeal.strMealThumb}" alt="${singleMeal.strMeal}">
            <p class="text-white fa-4x">${singleMeal.strMeal}</p>
        </div>
        <div class="container z-2 overflow-hidden">
            <div class="details text-white">
                <h3 class="fa-2x ">Instructions :</h3>
                <p>${singleMeal.strInstructions}</p>
                <p class="fa-2x">Area : <span>${singleMeal.strArea}</span></p>
                <p class="fa-2x">Category : <span>${singleMeal.strCategory
        }</span></p>
                <p class="fa-2x">Ingredients:</p>
                <ul>
                ${generateIngredientsList(singleMeal)}
                </ul>
                ${tagString}
                <p class="fa-2x">Links :</p>
                <a href="${singleMeal.strSource
        }" class="btn btn-success" target="_blank">Source</a>
                <a href="${singleMeal.strYoutube
        }" class="btn btn-danger" target="_blank">Youtube</a>
                <a id="backhome" href="#home" class="btn btn-secondary "><i class="fa-solid fa-bowl-food me-2"></i>Back to Dishes</a>
            </div>
        </div>
    </div>`;
    $(".meals").html(meal);
    backHome();
};

function generateIngredientsList(meal) {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
            ingredientsList += `<li class="btn btn-outline-primary m-2">${measure} ${ingredient}</li>`;
        }
    }
    return ingredientsList;
}

const backHome = () => {
    $("#backhome").click(function () {
        $(".meals").html(fetchMeals("", "s"));
    });
};

// !SEARCH
function searchPage() {
    $(".meals").html(`<div class="container" id="search">
    <div id="searchwrapper" class="text-center p-3 d-flex">
    <input id="nameSearch"  class="btn btn-dark w-50 m-1" placeholder="search by meal name " >
    <input id="letterSearch" class="btn btn-dark w-50 m-1" placeholder="search by first letter" >
    </div>
</div>
<div class="container">
            <div class=" row py-5 g-4 searchDisplay">
            </div>
        </div>`);
    searchByName();
    searchByLetter();
}

const searchByName = () => {
    $("#nameSearch").keyup(function () {
        let enteredName = $("#nameSearch").val();
        let typeOfFilter = "s";
        fetchMeals(enteredName, typeOfFilter);
    });
};

function searchByLetter() {
    $("#letterSearch").on("input", function () {
        const inputValue = this.value;
        if (inputValue.length > 1) {
            this.value = inputValue.charAt(0);
        }
        let enteredLetter = $("#letterSearch").val();
        let typeOfFilter = "f";
        fetchMeals(enteredLetter, typeOfFilter);
    });
}

// !CATEGORY
async function fetchCategories() {
    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/categories.php`
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        var dataCat = data.categories;
        if (dataCat) {
            displayCategories(dataCat);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function displayCategories(catArray) {
    let cols = "";
    for (let i = 0; i < catArray.length; i++) {
        cols += `
        <picture class="main-item col-md-3 position-relative">
            <img src="${catArray[i].strCategoryThumb}" alt="meal" />
            <div class="layer">
                <h3 class="text-white">${catArray[i].strCategory}</h3>
            </div>
        </picture>`;
    }
    $(".meals").html(cols);
    getCategory();
}

function getCategory() {
    $(".main-item").click(function () {
        let title = $(this).text().trim();
        let typeOfFilter = "c";
        fetchFilter(typeOfFilter, title);
    });
}

async function fetchFilter(typeOfFilter, filter) {
    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?${typeOfFilter}=${filter}`
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        var dataFilter = data.meals;
        if (dataFilter) {
            displayMeals(dataFilter);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// !AREA

async function fetchArea() {
    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        var dataArea = data.meals;
        if (dataArea) {
            displayArea(dataArea);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function displayArea(areaArray) {
    let cols = "";
    for (let i = 0; i < areaArray.length; i++) {
        cols += `
        <div class="main-item col-md-3">
            <div class="text-center"><i class="fa-solid fa-earth-asia fa-white fa-5x"></i></div>
            <h3 class="text-white text-center">${areaArray[i].strArea}</h3>
        </div>`;
    }
    $(".meals").html(cols);
    getArea();
}

function getArea() {
    $(".main-item").click(function () {
        let title = $(this).text().trim();
        let typeOfFilter = "a";
        fetchFilter(typeOfFilter, title);
    });
}

// !Ingredients

async function fetchIng() {
    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        var dataIng = data.meals;
        if (dataIng) {
            displayIng(dataIng);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function displayIng(ingArray) {
    let cols = "";
    for (let i = 0; i < ingArray.length; i++) {
        cols += `
        <div class="main-item col-md-3">
            <div class="text-center"><i class="fa-solid fa-utensils fa-white fa-5x"></i>
            </div>
            <h3 class="text-white text-center">${ingArray[i].strIngredient}</h3>
        </div>`;
    }
    $(".meals").html(cols);
    getIng();
}

function getIng() {
    $(".main-item").click(function () {
        let title = $(this).text().trim();
        let typeOfFilter = "i";
        fetchFilter(typeOfFilter, title);
    });
}

function contactPage() {
    $(".showContact").html(`
<div class="row py-5 g-4 meals">
    <div class="min-vh-100 d-flex justify-content-center align-items-center">
        <div class="container w-75 text-center">
            <div class="row g-4">
                <div class="col-md-6">
                    <input type="text" id="nameInput" class="form-control" placeholder="Enter Your Name">
                    <div class="alert alert-danger w-100 mt-2 d-none">Special characters and numbers not allowed
                    </div>
                </div>

                <div class="col-md-6">
                    <input type="email" id="emailInput" class="form-control" placeholder="Enter Your Email">
                    <div class="alert alert-danger w-100 mt-2 d-none">Email not valid *exemple@yyy.zzz</div>
                </div>

                <div class="col-md-6">
                    <input type="tel" id="phoneInput" class="form-control" placeholder="Enter Your phone">
                    <div class="alert alert-danger w-100 mt-2 d-none">Enter valid Phone Number</div>
                </div>

                <div class="col-md-6">
                    <input type="number" id="ageInput" class="form-control" placeholder="Enter Your Age">
                    <div class="alert alert-danger w-100 mt-2 d-none">Enter valid age</div>
                </div>

                <div class="col-md-6">
                    <input type="password" id="pass1" class="form-control" placeholder="Enter Your Password">
                    <div class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid password *Minimum eight characters, at least one letter and one number:*
                    </div>
                </div>

                <div class="col-md-6">
                    <input type="password" id="pass2" class="form-control" placeholder="Retype Your Password">
                    <div class="alert alert-danger w-100 mt-2 d-none">Password Must Match</div>
                </div>
            </div>
            <button type="submit" class="btn btn-outline-danger px-2 mt-3" disabled="true" id="btnSubmit">Submit</button>
        </div>
    </div>
</div>`);


    function validateName() {
        $('#nameInput').on('keyup', function () {
            let valo = $(this).val();
            let regex = /^[a-zA-Z\s]*$/;
            let alertBox = $(this).next();
            if (!regex.test(valo)) {
                alertBox.removeClass('d-none');
                alertBox.addClass('d-block');
                $('#btnSubmit').attr('disabled', true);
            } else {
                $('#btnSubmit').removeAttr('disabled');
                alertBox.addClass('d-none');
            }
        });
    }

    function validateEmail() {
        $('#emailInput').on('keyup', function () {
            let valo = $(this).val();
            let regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            let alertBox = $(this).next();
            if (!regex.test(valo)) {
                alertBox.removeClass('d-none');
                alertBox.addClass('d-block');
                $('#btnSubmit').attr('disabled', true);
            } else {
                $('#btnSubmit').removeAttr('disabled');
                alertBox.addClass('d-none');
            }
        });
    }

    function validatePhone() {
        $('#phoneInput').on('keyup', function () {
            let valo = $(this).val();
            let regex = /^\+?\d{1,3}[-. ]?\(?\d{1,4}\)?[-. ]?\d{1,4}[-. ]?\d{1,9}$/;
            let alertBox = $(this).next();
            if (!regex.test(valo)) {
                alertBox.removeClass('d-none');
                alertBox.addClass('d-block');
                $('#btnSubmit').attr('disabled', true);
            } else {
                $('#btnSubmit').removeAttr('disabled');
                alertBox.addClass('d-none');
            }
        });
    }

    function validateAge() {
        $('#ageInput').on('keyup', function () {
            let valo = $(this).val();
            let regex = /^(?:[1-9][0-9]?|1[0-4][0-9]|150)$/;
            let alertBox = $(this).next();
            if (!regex.test(valo)) {
                alertBox.removeClass('d-none');
                alertBox.addClass('d-block');
                $('#btnSubmit').attr('disabled', true);
            } else {
                $('#btnSubmit').removeAttr('disabled');
                alertBox.addClass('d-none');
            }
        });
    }
    
    function validatePassword() {
        $('#pass1').on('keyup', function () {
            let valo = $(this).val();
            let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            let alertBox = $(this).next();
            if (!regex.test(valo)) {
                alertBox.removeClass('d-none');
                alertBox.addClass('d-block');
                $('#btnSubmit').attr('disabled', true);
            } else {
                $('#btnSubmit').removeAttr('disabled');
                alertBox.addClass('d-none');
            }
        });
    }

    $('#btnSubmit').click(function () {
        $('#nameInput').val('');
        $('#emailInput').val('');
        $('#phoneInput').val('');
        $('#ageInput').val('');
        $('#pass1').val('');
        $('#pass2').val('');
    })

    validateName();
    validateEmail();
    validatePhone();
    validateAge();
    validatePassword();
}
