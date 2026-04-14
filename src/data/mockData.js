import biryaniNonvegImg from "../assets/food/biryani_nonveg.jpg";
import breadPakoraImg from "../assets/food/bread_pakora.jpg";
import chaasImg from "../assets/food/chaas.jpg";
import coffeeImg from "../assets/food/coffee.jpg";
import dalImg from "../assets/food/dal.jpg";
import maggiImg from "../assets/food/maggi.jpg";
import mangoLassiImg from "../assets/food/mango_lassi.jpg";
import matarPaneerImg from "../assets/food/matar_paneer.jpg";
import oreoImg from "../assets/food/oreo.jpg";
import pohaImg from "../assets/food/poha.jpg";
import rajmaImg from "../assets/food/rajma.jpg";
import samosaImg from "../assets/food/samosa.jpg";
import sandwichImg from "../assets/food/sandwich.jpg";
import teaImg from "../assets/food/tea.jpg";
import tikkaImg from "../assets/food/tikka.jpg";

export const INITIAL_SNACKS = [
    { id: "s1", name: "Samosa", price: 20, ordersCount: 142, category: "Snack", imageUrl: samosaImg },
    { id: "s2", name: "Veg Sandwich", price: 50, ordersCount: 98, category: "Breakfast", imageUrl: sandwichImg },
    { id: "s3", name: "Mango Lassi", price: 20, ordersCount: 210, category: "Drink", imageUrl: mangoLassiImg },
    { id: "s4", name: "Poha", price: 50, ordersCount: 75, category: "Breakfast", imageUrl: pohaImg },
    { id: "s5", name: "Bread Pakora", price: 30, ordersCount: 133, category: "Snack", imageUrl: breadPakoraImg },
    { id: "s6", name: "Chaas", price: 20, ordersCount: 88, category: "Drink", imageUrl: chaasImg },
    { id: "s7", name: "Veg Maggi", price: 25, ordersCount: 195, category: "Snack", imageUrl: maggiImg },
    { id: "s8", name: "Oreo", price: 10, ordersCount: 301, category: "Snack", imageUrl: oreoImg },
    { id: "s9", name: "Rajma Rice", price: 80, ordersCount: 88, category: "Meal", imageUrl: rajmaImg },
    { id: "s10", name: "Paneer Tikka", price: 100, ordersCount: 100, category: "Meal", imageUrl: tikkaImg },
    { id: "s11", name: "Dal Rice", price: 80, ordersCount: 100, category: "Meal", imageUrl: dalImg },
    { id: "s12", name: "Matar Paneer Rice", price: 80, ordersCount: 100, category: "Meal", imageUrl: matarPaneerImg },
    { id: "s13", name: "Ginger Tea", price: 20, ordersCount: 100, category: "Drink", imageUrl: teaImg },
    { id: "s14", name: "Chicken Biryani", price: 100, ordersCount: 100, category: "Meal", imageUrl: biryaniNonvegImg },
    { id: "s15", name: "Coffee", price: 20, ordersCount: 100, category: "Drink", imageUrl: coffeeImg },
  ];
  
  export const INITIAL_STUDENTS = [
    { id: "st1", name: "Rewa Bisht", referralCode: "EDZ-A3K9PL", totalSpent: 570, createdAt: "2024-01-10" },
    { id: "st2", name: "Priyanshu Bhatia", referralCode: "EDZ-P7M2QX", totalSpent: 700, createdAt: "2024-01-12" },
    { id: "st3", name: "Aryama Sharma", referralCode: "EDZ-R5N8YZ", totalSpent: 395, createdAt: "2024-01-15" },
    { id: "st4", name: "Praval Dahliya", referralCode: "EDZ-S1J4KW", totalSpent: 690, createdAt: "2024-01-18" },
    { id: "st5", name: "Rom Roy", referralCode: "EDZ-K6T0BV", totalSpent: 460, createdAt: "2024-01-20" },
  ];
  
  export const INITIAL_ORDERS = [
    // Rewa Bisht
    { id: "o1", studentId: "st1", snackId: "s1", snackName: "Samosa", quantity: 3, payableAmount: 60, createdAt: "2024-03-01T10:30:00" },
    { id: "o2", studentId: "st1", snackId: "s3", snackName: "Mango Lassi", quantity: 2, payableAmount: 40, createdAt: "2024-03-02T11:00:00" },
    { id: "o3", studentId: "st1", snackId: "s9", snackName: "Rajma Rice", quantity: 2, payableAmount: 160, createdAt: "2024-03-03T13:15:00" },
    { id: "o4", studentId: "st1", snackId: "s13", snackName: "Ginger Tea", quantity: 3, payableAmount: 60, createdAt: "2024-03-04T08:00:00" },
    { id: "o5", studentId: "st1", snackId: "s10", snackName: "Paneer Tikka", quantity: 2, payableAmount: 200, createdAt: "2024-03-05T13:00:00" },
    { id: "o6", studentId: "st1", snackId: "s8", snackName: "Oreo", quantity: 5, payableAmount: 50, createdAt: "2024-03-06T15:00:00" },
  
    // Priyanshu Bhatia
    { id: "o7", studentId: "st2", snackId: "s14", snackName: "Chicken Biryani", quantity: 2, payableAmount: 200, createdAt: "2024-03-01T09:45:00" },
    { id: "o8", studentId: "st2", snackId: "s2", snackName: "Veg Sandwich", quantity: 3, payableAmount: 150, createdAt: "2024-03-02T10:30:00" },
    { id: "o9", studentId: "st2", snackId: "s15", snackName: "Coffee", quantity: 5, payableAmount: 100, createdAt: "2024-03-03T09:00:00" },
    { id: "o10", studentId: "st2", snackId: "s5", snackName: "Bread Pakora", quantity: 3, payableAmount: 90, createdAt: "2024-03-04T14:00:00" },
    { id: "o11", studentId: "st2", snackId: "s11", snackName: "Dal Rice", quantity: 2, payableAmount: 160, createdAt: "2024-03-05T13:30:00" },
  
    // Aryama Sharma
    { id: "o12", studentId: "st3", snackId: "s4", snackName: "Poha", quantity: 2, payableAmount: 100, createdAt: "2024-03-01T08:30:00" },
    { id: "o13", studentId: "st3", snackId: "s6", snackName: "Chaas", quantity: 3, payableAmount: 60, createdAt: "2024-03-02T12:00:00" },
    { id: "o14", studentId: "st3", snackId: "s12", snackName: "Matar Paneer Rice", quantity: 2, payableAmount: 160, createdAt: "2024-03-03T13:00:00" },
    { id: "o15", studentId: "st3", snackId: "s7", snackName: "Veg Maggi", quantity: 3, payableAmount: 75, createdAt: "2024-03-04T11:00:00" },
  
    // Praval Dahliya
    { id: "o16", studentId: "st4", snackId: "s14", snackName: "Chicken Biryani", quantity: 3, payableAmount: 300, createdAt: "2024-03-01T13:00:00" },
    { id: "o17", studentId: "st4", snackId: "s10", snackName: "Paneer Tikka", quantity: 2, payableAmount: 200, createdAt: "2024-03-02T13:30:00" },
    { id: "o18", studentId: "st4", snackId: "s13", snackName: "Ginger Tea", quantity: 4, payableAmount: 80, createdAt: "2024-03-03T08:00:00" },
    { id: "o19", studentId: "st4", snackId: "s8", snackName: "Oreo", quantity: 5, payableAmount: 50, createdAt: "2024-03-04T16:00:00" },
    { id: "o20", studentId: "st4", snackId: "s3", snackName: "Mango Lassi", quantity: 3, payableAmount: 60, createdAt: "2024-03-05T12:00:00" },
  
    // Rom Roy
    { id: "o21", studentId: "st5", snackId: "s7", snackName: "Veg Maggi", quantity: 4, payableAmount: 100, createdAt: "2024-03-01T13:00:00" },
    { id: "o22", studentId: "st5", snackId: "s1", snackName: "Samosa", quantity: 5, payableAmount: 100, createdAt: "2024-03-02T11:30:00" },
    { id: "o23", studentId: "st5", snackId: "s11", snackName: "Dal Rice", quantity: 2, payableAmount: 160, createdAt: "2024-03-03T13:00:00" },
    { id: "o24", studentId: "st5", snackId: "s15", snackName: "Coffee", quantity: 5, payableAmount: 100, createdAt: "2024-03-04T09:00:00" },
  ];