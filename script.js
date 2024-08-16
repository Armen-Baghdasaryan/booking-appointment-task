//For mobile menu
const headerNavbar = document.querySelector(".header-nav-items");
let menuState = false;

const menuBtn = document.querySelector(".header-menu-btn");
menuBtn.addEventListener("click", () => {
  menuState = !menuState;

  if (menuState) {
    headerNavbar.classList.add("menu-visible");
  } else {
    headerNavbar.classList.remove("menu-visible");
  }
});

document.addEventListener("click", (e) => {
  if (!headerNavbar.contains(e.target) && !menuBtn.contains(e.target)) {
    headerNavbar.classList.remove("menu-visible");
    menuState = !menuState;
  }
});

// Appointment Logic Implementation
const categoryBtns = document.querySelectorAll(".category-btn");
const isMobile = window.innerWidth <= 1123;
let isStart = false;

const ulElements = document.querySelectorAll("ul");
if (isMobile) {
  ulElements.forEach((ul) => ul.classList.remove("active"));
}

categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll("ul")
      .forEach((i) => i.classList.add("auto-height"));
    document.getElementById("category-image").style.visibility = "hidden";
    onCategoryClick(btn);
  });
});

function onCategoryClick(category) {
  let subMenu = category.getAttribute("data-sub");
  let subMenuArray;

  try {
    subMenuArray = JSON.parse(subMenu);
  } catch (error) {
    // If parsing error, try to correct the format
    try {
      subMenu = subMenu.replace(/'/g, '"');
      subMenuArray = JSON.parse(subMenu);
    } catch (error) {
      console.error("Error during parsing JSON:", error);
      return;
    }
  }

  // Get the current active list and all its sublists
  const currentList = category.parentElement;
  currentList.classList.remove("active");

  // Checking if the list for this element is already open
  if (category.classList.contains("open")) {
    // Closing only the current list
    closeSubsequentMenus(currentList, category);
    category.classList.remove("open");
  } else {
    // Close all subsequent lists
    closeSubsequentMenus(currentList, category);

    // Create a new list
    const list = document.createElement("ul");
    list.classList.add("active");

    // If mobile mode, insert a list under the current element
    if (isMobile) {
      category.after(list);
    } else {
      list.style.left = `${category.parentElement.clientWidth}px`;
      currentList.appendChild(list);
    }

    subMenuArray.forEach((sub) => {
      const keys = Object.keys(sub);
      const values = Object.values(sub);

      if (Array.isArray(values[0])) {
        const listItem = document.createElement("li");
        listItem.classList.add("category-btn");
        listItem.innerText = keys[0];
        listItem.setAttribute("data-sub", JSON.stringify(values[0]));
        list.appendChild(listItem);

        listItem.addEventListener("click", () => {
          onCategoryClick(listItem);
        });
      } else {
        const listItem = document.createElement("li");
        listItem.innerText = sub.name || keys[0];
        listItem.classList.add("no-arrow");
        list.appendChild(listItem);
        listItem.addEventListener("click", () =>
          alert(`Logic for "${sub.name || keys[0]}" !!!`)
        );
      }
    });

    category.classList.add("open");
    category.classList.add("rotate-arrow");
  }
}

function closeSubsequentMenus(currentList, clickedCategory) {
  // Delete all nested lists, starting from the clickedCategory level
  let nextSibling = clickedCategory.nextElementSibling;

  // Remove all ul elements that come after the current parent
  while (nextSibling) {
    if (nextSibling.tagName === "UL") {
      nextSibling.remove();
    }
    nextSibling = nextSibling.nextElementSibling;
  }

  // Remove all ul elements inside the parent of the current list
  const ulElements = currentList.querySelectorAll("ul");
  ulElements.forEach((ul) => ul.remove());

  // Reset 'open' classes for all buttons at the current level and levels below
  const allBtns = currentList.querySelectorAll(".category-btn");
  allBtns.forEach((btn) => btn.classList.remove("open"));
}
