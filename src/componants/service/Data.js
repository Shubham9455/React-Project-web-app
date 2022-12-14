import React from "react";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { addToFavourites } from "../firebase_";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase_";
import { query, collection, getDocs, where, doc } from "firebase/firestore";
import { Dots, Spinner, Waves } from "loading-animations-react";

import { BoxLoading, BabelLoading } from "react-loadingg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const api_key = "pub_12336aec8490b5b33b0e72e94a02768d93cb1";

// const old_url =

const url = "https://newsdata.io/api/1/news?apikey=" + api_key + "&country=in";

const Data = (props) => {
  const navigate = useNavigate();
  const { favbutton, uid } = props;
  const [data, setData] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const getData = async () => {
    console.log("Fetching Data");
    const response = await fetch(url);
    const mydata = await response.json();
    setData(mydata.results);
  };
  
  const getFavorites = async () => {
    console.log("Fetching Favourite Data");
    const newData = [];
    const docSnap = await getDocs(collection(db, "userData", uid, "title"));
    console.log(docSnap);
    docSnap.forEach((doc) => {
      newData.push(doc.data());
    });
    console.log(newData);
    setData(newData);
  };

  useEffect(() => {
    if(props.livetvButton){
      setData([]);
      return;
    }
    if (favbutton) {
      console.log("getting favs");
      getFavorites();
    } else {
      getData();
    }
  }, [favbutton,props.livetvButton]);

  return !loading ? (
    <div style={{ margin: "10px 20%" }}>
      <ToastContainer />
      {data ? (
        data.map((item, index) => {
          if (1)
            return (
              <div className="news" key={index}>
                <Card
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gridGap: "2rem",
                    gridAutoRows: "auto",
                    margin: "20px",
                  }}
                >
                  <Card.Img
                    style={{
                      borderRadius: "8px",
                      display: "block",
                      height: "15rem",
                    }}
                    variant="top"
                    src={
                      item.image_url ? item.image_url : "/icons8-news-480.png"
                    }
                  />
                  <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Text>{/* {item.description} */}</Card.Text>

                    <Button
                      variant="primary"
                      href={item.link}
                      style={{
                        padding: "0.5rem 2rem",
                        margin: "0.5rem",
                        display: "inline-block",
                      }}
                    >
                      Visit Site
                    </Button>
                    {!favbutton ? (
                      <Button
                        variant="primary"
                        style={{
                          padding: "0.5rem 1rem",
                          display: "inline-block",
                        }}
                        onClick={() => {
                          if (user)
                            addToFavourites(
                              user.uid,
                              item.title,
                              item.image_url,
                              item.link
                            );
                        }}
                      >
                        Add To Favourites
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Card.Body>
                </Card>
              </div>
            );
        })
      ) : (
        <div style={{ marginTop: "20rem" }}>
          <BoxLoading size="large"></BoxLoading>
          {/* <Dots text="Loading..." style={{ marginTop: "20rem" }} /> */}
        </div>
      )}
    </div>
  ) : (
    <div style={{ marginTop: "20rem" }}>
      <BoxLoading size="large"></BoxLoading>
      {/* <Dots text="Loading..." style={{ marginTop: "20rem" }} /> */}
    </div>
  );
};

export default Data;
