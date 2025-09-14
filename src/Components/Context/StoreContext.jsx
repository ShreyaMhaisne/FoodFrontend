import axios from "axios";
import { createContext, useEffect, useState } from "react"


export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setcartItems] = useState({});
   const backendUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://food-backendd.vercel.app";

const url = backendUrl;

    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [food_list, setFoodList] = useState([])

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setcartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setcartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }

        if (token) {
            try {
                const res = await axios.post(
                    `${url}/api/cart/add`,
                    { itemId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("Cart Add Response:", res.data); // ✅ log response
            } catch (err) {
                console.error("Cart Add Error:", err.response?.data || err.message);
            }
        }
    };

    const removeFromCart = async (itemId) => {
        setcartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

        if (token) {
            try {
                const res = await axios.post(
                    `${url}/api/cart/remove`,
                    { itemId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // ✅ FIXED
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("Cart Remove Response:", res.data);
            } catch (err) {
                console.error("Cart Remove Error:", err.response?.data || err.message);
            }
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }

        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
    }


const loadCartData = async (token) => {
  if (!token) return;
  try {
    const res = await axios.post(
      url + "/api/cart/get",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    setcartItems(res.data.cartData || {});
  } catch (err) {
    console.error("Load Cart Error:", err.response?.data || err.message);
  }
};
    useEffect(() => {
  async function loadData() {
    await fetchFoodList();
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      await loadCartData(savedToken); 
    }
  }
  loadData();
}, []);


    const contextValue = {
        food_list,
        cartItems,
        setcartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider