const foods = [
{
    id: "1",
    title: "Eggs x 12",
    picture: require("./assets/images/books/egg.png"),
    cost: 5
},
{
    id: "2",
    title: "bread loaf",
    picture: require("./assets/images/books/bread.png"),
    cost: 4
},
{
    id: "3",
    title: "Chicken 1/2 lb",
    picture: require("./assets/images/books/chicken.png"),
    cost: 5
},
{
    id: "4",
    title: "Tomato",
    picture: require("./assets/images/books/tomato.png"),
    cost: 1
},
{
    id: "5",
    title: "potato",
    picture: require("./assets/images/books/potato.png"),
    cost: 1
}
];export const getProducts = () => {
    return foods;
    
}