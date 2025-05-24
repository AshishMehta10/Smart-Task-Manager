import React, { useState } from "react";
import "./home.css";
// import Classroom from "../../Images/classroom.png";
import Navbar from "./Navbar";
import { NavLink , useNavigate} from "react-router-dom";
import Footer from "./Footer";
import { useEffect } from "react";

function Landing() {
  const [LClass, setLClass] = useState(false);
  const [EMentor, setEMentor] = useState(false);
  const [subject, setSubject] = useState('');
  
  const [facList, setFacList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  const handleSearch = ()=>{
    // console.log('working')
    navigate(`/Search/${subject}`)
  }

  const AA = ()=>{
    setEMentor(true);
    setLClass(false);
  }

  const BB = ()=>{
    setEMentor(false);
    setLClass(true);
  }

  const teachersList = async(sub)=>{
    setLoading(true);

    const response = await fetch(`/api/course/${sub}`, {
      method: 'GET',
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    setFacList(data.data);
    console.log(data.data);
    setLoading(false);
  }

  const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);


  return (
    <>
    <Navbar/>
    {/* Top Section */}
   <div className="homeContainer">
   <div className="top">
        <div className="left">
          <h2 class="line-1 anim-typewriter">
          Smart Task Management for your Productive Life!
         </h2>

         <p id ="homepara" style={{
                fontSize: "20px",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 1s ease-in-out, transform 1s ease-in-out"
            }}>
                Manage tasks effortlessly, track progress seamlessly, and achieve more without the hassle!
            </p>          
          <div className='landbtns'>
        <NavLink to='/log-in'><button className="button-85" >Login</button></NavLink>
        <NavLink to='/register' ><button className="button-85">Signup</button></NavLink>
      </div>


        </div>
        <div className="right" style={{paddingLeft:"200px"}}>
          <img src='https://s3.aws-k8s.generated.photos/ai-generated-photos/bg-removal-uploads/results/133/729cae6e-3b32-4b0e-9a1e-7af3355271e5.png' width={500} alt="" />
        
        
        </div>

      </div>
      <div id="gallContain">
      <h1 id="gallHead">LEARN BEYOND LIMITS</h1>
      <div class="gallery">
  <span style={{ "--i": 1 }}>
    <img src="https://img.freepik.com/free-vector/learning-concept-illustration_114360-6186.jpg?t=st=1740004396~exp=1740007996~hmac=0080a4f334c33d7eee56c7cbde96747953e30c211402f88b5d5176a72636ca46&w=740" alt="" />
  </span>
  <span style={{ "--i": 2 }}>
    <img src="https://img.freepik.com/free-vector/teacher-concept-illustration_114360-1638.jpg?t=st=1740004494~exp=1740008094~hmac=6d82724de4a36ceb0b001124439b42de0732d76e3da87b6379f55bc108cd06ab&w=740" alt="" />
  </span>
  <span style={{ "--i": 3 }}>
    <img src="https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg?t=st=1740004618~exp=1740008218~hmac=cff4dc782c2e80939d42f61162c11ec2dc97da7e0bb0fbfeec3fc80420057648&w=1060" alt="" />
  </span>
  <span style={{ "--i": 4 }}>
    <img src="https://img.freepik.com/free-vector/e-learning-icons-flat_1284-3950.jpg?t=st=1740004557~exp=1740008157~hmac=f6a8a558eb4c7c1fc5a7068a798fdee671076071c4620f8fb62357681bbeba3d&w=740" alt="" />
  </span>
  <span style={{ "--i": 5 }}>
    <img src="https://img.freepik.com/free-vector/account-concept-illustration_114360-279.jpg?t=st=1740004738~exp=1740008338~hmac=94851f7d6aa65d0462daaddfc4f5b1ee84904d7e2e37aedaf42d8371ea5f3ba8&w=740" alt="" />
  </span>
  <span style={{ "--i": 6 }}>
    <img src="https://img.freepik.com/free-vector/boy-searching-laptop-with-stem-education-map-cartoon-style-isolated-white-background_1308-46527.jpg?t=st=1740004793~exp=1740008393~hmac=d21065a8bb59878db61d71007d2eb0ab9b3eb2feff811769b4f0e4190f72d39d&w=826" alt="" />
  </span>
  <span style={{ "--i": 7 }}>
    <img src="https://img.freepik.com/free-vector/flat-woman-chatting-with-chatbot-communicating-ai-robot-assistant_88138-959.jpg?t=st=1740004929~exp=1740008529~hmac=c8ee7363462c0b707424cef2dfbd597958b6e42be1d8b84cbe2be446ec0c5e32&w=1060" alt="" />
  </span>
  <span style={{ "--i": 8 }}>
    <img src="https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg?t=st=1740005174~exp=1740008774~hmac=d3524d3151e29b47b80cc5f3203b766b07b70f3a7bef7c7f1ca6d759cd6d6e69&w=1060" alt="" />
  </span>
</div>


      </div>

   </div>
   
<Footer/>
    </>
  );
}

export default Landing;
