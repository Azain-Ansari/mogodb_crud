import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./home.css";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";




const baseUrl = "http://localhost:3000";

const Home = () => {

    const [currentDateTime, setCurrentDateTime] = useState(""); 

    const getCurrentDateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString();
      const formattedTime = now.toLocaleTimeString();
      const dateTimeString = `${formattedDate} ${formattedTime}`;
      setCurrentDateTime(dateTimeString);
    };
  


    useEffect(() => {
        getCurrentDateTime();
      }, []);
    
    



  const postTitleInputRef = useRef(null);
  const postBodyInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  

  const [allPosts, setAllPosts] = useState([]);
  const [toggleRefresh, setToggleRefresh] = useState(false);

  const getAllPost = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/api/v1/posts`);
      console.log(response.data);

      setIsLoading(false);
      setAllPosts([...response.data]);
    } catch (error) {
      console.log(error.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllPost();

    return () => {
      // cleanup function
    };
  }, [toggleRefresh]);


const submitHandler = async (e) => {
    e.preventDefault();
  
    try {
      setIsLoading(true);
      const response = await axios.post(`${baseUrl}/api/v1/post`, {
        title: postTitleInputRef.current.value,
        text: postBodyInputRef.current.value,
      });
  
      setIsLoading(false);
      console.log(response.data);
      setAlert(response.data.message);
      setToggleRefresh(!toggleRefresh);
  
      // Sweet Alert
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,

      });
       
      postTitleInputRef.current.value = "";
      postBodyInputRef.current.value = "";

    } catch (error) {
      console.log(error?.data);
      setIsLoading(false);
  
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "An error occurred.",
      });
    }
  };
  
  const deletePostHandler = async (_id) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`${baseUrl}/api/v1/post/${_id}`, {
        title: postTitleInputRef.current.value,
        text: postBodyInputRef.current.value,
      });
  
      setIsLoading(false);
      console.log(response.data);
      setAlert(response.data.message);
      setToggleRefresh(!toggleRefresh);
  
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      });
    } catch (error) {
      console.log(error?.data);
      setIsLoading(false);
  
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "An error occurred.",
      });
    }
  };
  
const editSaveSubmitHandler = async (_id, updatedTitle, updatedText) => {
    try {
      setIsLoading(true);
      const response = await axios.put(`${baseUrl}/api/v1/post/${_id}`, {
        title: updatedTitle,
        text: updatedText,
      });
  
      setIsLoading(false);
      console.log(response.data);
      setAlert(response?.data?.message);
      setToggleRefresh(!toggleRefresh);
  
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      });
    } catch (error) {
      // handle error
      console.log(error?.data);
      setIsLoading(false);
  
      // Sweet Alert for error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "An error occurred.",
      });
    }
  };
  
  return (
    <div>
      <form onSubmit={submitHandler}>
      <h1>CRUD MONGODB WITH EXPRESS IN REACT</h1>

        <label htmlFor="postTitleInput"> Post Title:</label>
        <input id="postTitleInput" type="text" required minLength={2} maxLength={20} ref={postTitleInputRef} />
        <br />

        <label htmlFor="postBodyInput"> Post Body:</label>
        <textarea
          id="postBodyInput"
          type="text"
          required
          minLength={2}
          maxLength={999}
          ref={postBodyInputRef}
        ></textarea>
        <br />

        <button className="button1" type="submit">Publish Post</button>
        <span>
          {alert && alert}
          <div className="text-center">
        {isLoading && (
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only"></span>
          </div>
        )}
      </div>
        </span>
      </form>

      <br />

      <div className="POST"> 
        {allPosts.map((post) => (
          <div key={post._id} className="post">
              
              <div>
                <h2>{post.title}</h2>
                <div>
        {currentDateTime && <p>{currentDateTime}</p>}
           </div>

                <p>{post.text}</p>


                <p className="regards">REGARDS by  AZAIN ANSARI !</p>

                <button className="button1"
               
onClick={(e) => {
  Swal.fire({
    title: "Edit Post",
    html: `
      <input id="swal-input1" class="swal2-input" value="${post.title}" placeholder="Title">
      <textarea id="swal-input2" class="swal2-textarea" placeholder="Body">${post.text}</textarea>
    `,
    showCancelButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
    preConfirm: () => {
      const title = Swal.getPopup().querySelector("#swal-input1").value;
      const text = Swal.getPopup().querySelector("#swal-input2").value;

      editSaveSubmitHandler(post._id, title, text);
    },
  });
}}
>
<i className="bi bi-pencil">edit</i> 
</button> 


                <button  className="button1"
                  onClick={(e) => {
                    deletePostHandler(post._id);
                  }}
                >
                   <i className="bi bi-trash">delete</i>
                </button >
              </div>
            
            
          </div>
  
        ))}

        <br />
      </div>
    </div>
  );
};

export default Home;