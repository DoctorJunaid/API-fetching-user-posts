import {HashLoader} from "react-spinners";

const LoaderComponent = () => <div className={"h-screen w-screen z-999 flex justify-center items-center"}><HashLoader
    color="#ddddd9"
    speedMultiplier={4}
    size={100}
/></div>
export default LoaderComponent;