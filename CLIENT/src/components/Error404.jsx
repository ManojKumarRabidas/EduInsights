function Error404() {
  return (
    <div className="container my-2  p-5 mb-5  rounded">
        <h1 className="text-center" style={{fontSize: "clamp(5rem, 30vmin, 20rem)", fontFamily: "'Open Sans', sans-serif"}}>404</h1>
      <h3 className="text-center mb-5">Page not found</h3>
      <h5 className="text-center mb-5">Due to some technical problem we are unable to procced. Please close the window and try again later.</h5>
    </div>
  );
}
export default Error404;

// font-size: clamp(5rem, 40vmin, 20rem);
//   font-family: 'Open Sans', sans-serif;