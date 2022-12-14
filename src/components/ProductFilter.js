import { getAuth } from "firebase/auth";
import { collection, doc, getDocs, increment, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import db from '../firebase'
import coffee from '../images/Coffee.jpg'
import { AiFillHeart } from "react-icons/ai";


const ProductFilter = () => {
  const [data, setData] = useState();
  const [dataCopy, setDataCopy] = useState();
  const [qty, setQty] = useState();
  const [price, setPrice] = useState();
  const [no, setNo] = useState(0);
  const [index, setIndex] = useState(0);
  const [favouriteName, setfavouriteName] = useState();
  const [favouritePrice, setfavouritePrice] = useState();

  useEffect(() => {
    getAllData()
  }, [])

  const getAllData = async () => {
    const alldata = []

    const querySnapshotcoffee = await getDocs(collection(db, "coffee"));
    querySnapshotcoffee.forEach((doc) => {
      alldata.push({ ...doc.data(), id: doc.id })
    });

    const querySnapshotdeserts = await getDocs(collection(db, "deserts"));
    querySnapshotdeserts.forEach((doc) => {
      alldata.push({ ...doc.data(), id: doc.id })
    });

    const querySnapshotsnacks = await getDocs(collection(db, "snacks"));
    querySnapshotsnacks.forEach((doc) => {
      alldata.push({ ...doc.data(), id: doc.id })
    });

    setData(alldata)
    setDataCopy(alldata)
  }

  const getCoffeType = async (type) => {
    onSnapshot(collection(db, type), (snapshot) => {
      setData(snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })))
    })
  }

  const truncate = (input) => input?.length > 75 ? `${input.substring(0, 75)}...` : input;

  const handelAddToCart = async (e) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (qty > 0) {
      const docRef = doc(db, "users", localStorage.getItem("id"))
      setDoc(docRef, {
        cart: {
          [`${no}`]: {
            srno: no,
            quantity: qty,
            product: e.target.value,
            price: price * qty
          },
        }
      }, { merge: true })
      updateDoc(docRef, {
        cartvalue: increment(qty * price),
      })
      setQty(0)
      setNo(no + 1)
      document.querySelectorAll("#input").forEach(input => {
        input.value = ""
      })
    }
  }

  const handelFavourite = async () => {
    console.log(index);
    const docRef = doc(db, "users", localStorage.getItem("id"))
    setDoc(docRef, {
      favourite: {
        [index]: {
          srno: index,
          product: favouriteName,
          price: favouritePrice
        }
      }
    }, { merge: true })
    setNo(no + 1)
  }
  if (data == "") {
    return (
      <>
        <div className="flex flex-col lg:flex-row mx-3 mt-20 justify-between">
          <div className="flex flex-row form-control md:grow">
            <input type="text" placeholder="Search categoty or menu" className="input text-white input-bordered border-primary grow" onChange={(e) => {

              if ((e.target.value).length > 0) {
                setData(data.filter(product => product.name.toLowerCase().includes((e.target.value).toLowerCase())))
              } else {
                setData(dataCopy)
              }
            }} />
          </div>
          <div className="tabs tabs-boxed lg:ml-5 lg:mt-0  mt-5 h-14 bg-neutral items-center rounded-2xl">
            <div className="tab text-xl text-white hover:text-primary active:text-warning" onClick={getAllData}>All</div>
            <div className="tab text-xl text-white hover:text-primary active:text-primary" onClick={() => {
              getCoffeType("coffee")
            }}>Coffee</div>
            <div className="tab text-xl text-white hover:text-primary active:text-primary" onClick={() => {
              getCoffeType("deserts")
            }}>Deserts</div>
            <div className="tab text-xl text-white hover:text-primary active:text-primary" onClick={() => {
              getCoffeType("snacks")
            }}>Snacks</div>
          </div>
        </div>
        <div className="grid place-items-center h-screen text-primary">
          <div className="text-5xl ">No results found</div>
        </div>
      </>
    )
  }
  else {
    return (
      <>
        <div className="flex flex-col lg:flex-row mx-3 mt-20 justify-between">
          <div className="flex flex-row form-control md:grow">
            <input type="text" placeholder="Search categoty or menu" className="input text-white input-bordered border-primary grow" onChange={(e) => {
              if ((e.target.value).length > 0) {
                setData(data.filter(product => product.name.toLowerCase().includes((e.target.value).toLowerCase())))
              } else {
                setData(dataCopy)
              }
            }} />
          </div>
          <div className="tabs tabs-boxed lg:ml-5 lg:mt-0  mt-5 h-14 bg-neutral items-center rounded-2xl">
            <div className="tab text-xl text-white hover:text-primary active:text-warning" onClick={getAllData}>All</div>
            <div className="tab text-xl text-white hover:text-primary active:text-primary" onClick={() => {
              getCoffeType("coffee")
            }}>Coffee</div>
            <div className="tab text-xl text-white hover:text-primary active:text-primary" onClick={() => {
              getCoffeType("deserts")
            }}>Deserts</div>
            <div className="tab text-xl text-white hover:text-primary active:text-primary" onClick={() => {
              getCoffeType("snacks")
            }}>Snacks</div>
          </div>
        </div>
        <div className="grid 2xl:grid-cols-6 lg:grid-cols-2 xl:grid-cols-3 grid-cols-1 mt-10 justify-items-center">
          {data ? data.map((product, index) =>
            <div className="relative card w-80 lg:w-80 bg-neutral shadow-xl mb-5 mx-10" key={product.id}>
              <div className="absolute top-2 right-2 tooltip tooltip-left rounded-lg" data-tip="Add to Favourite" onMouseEnter={() => {
                setfavouriteName(product.name)
                setfavouritePrice(product.price)
                setIndex(product.srno)
              }} onTouchStart={() => {
                setfavouriteName(product.name)
                setfavouritePrice(product.price)
                setIndex(product.srno)
              }}>
                <AiFillHeart className="btn btn-circle bg-transparent border-0 text-red-600 hover:bg-transparent hover:scale-125" onClick={handelFavourite} />
              </div>
              <figure><img src={coffee} alt="coffee" className="w-80 h-52" /></figure>
              <div className="card-body">
                <h2 className="card-title text-white h-10 ">{product.name}</h2>
                <div className="">Description: {truncate(product.description)}</div>
                <div className="card-actions flex">
                  <div className="text-green-600 text-lg">Price: ??? {product.price}</div>
                  <input type="number" min={0} max={100} id="input" placeholder="Enter Quantity" className=" grow rounded-lg pl-3 py-1 icon" required onChange={(e) => {
                    setQty(e.target.value)
                    setPrice(product.price)
                  }} autoComplete="off" />
                </div>
                <button className="btn btn-primary" value={product.name} onClick={handelAddToCart}>Add to cart</button>
              </div>
            </div>) : null}
        </div >
      </>
    );
  }
}

export default ProductFilter;