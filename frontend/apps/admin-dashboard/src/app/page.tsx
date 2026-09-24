import { redirect } from "next/navigation";
import React from "react";

const HomePage = () => {
  // return <div>Header</div>;
  //return <h1>Hello world</h1>
  //return <h2>Hi world<h1>
  redirect("/signin");
};

export default HomePage;
