import { useState } from "react";
import img from "../../assets/images/login1.png";
import { MainContent } from "../../constants/mainContent";
import { AiOutlineLock, AiOutlineMail, AiOutlineUnlock } from "react-icons/ai";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../components/ui/PageLoader";
import { loginWithEmailAdmin } from "../../api/auth-api";
import Swal from "sweetalert2";
import { Routers } from "../../constants/Routes";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await loginWithEmailAdmin(data);
      console.log(response)
      if (response?.success) {
        localStorage.setItem("token", response?.token);
        form.reset({
          email: "",
          password: "",
        });
        Swal.fire({
          icon: "success",
          title: "Login Success",
          text: "You have logged in successfully",
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          willClose: () => {
            navigate(Routers.Dashboard);
            window.location.reload();
          }
        });
        setTimeout(() => {
          navigate(Routers.Dashboard);
          window.location.reload();
        }, 3000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Invalid email or password",
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        })
      }

    } catch (error) {
      console.error("Error:", error?.message);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        text: error?.response?.data?.message || "Please check your email and password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PageLoader />}
      <div
        className="w-screen h-screen xl:p-20 flex items-center justify-center lg:p-16 md:p-10 p-4"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full lg:w-2/6 py-10 p-4 bg-[#ffffff6a] backdrop-blur-md rounded-3xl border shadow-[0_0_10px_rgba(0,0,0,0.1)] flex flex-col items-center">
          <img src={MainContent.logo} alt="Bionova Logo" className="py-4 h-20" />

          <h1 className="text-3xl font-bold text-center my-5">
            <span className="text-bg-color">A</span>dmin{" "}
            <span className="text-bg-color">L</span>ogin
          </h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5 w-full mb-5"
            >
              {/* EMAIL INPUT */}
              <FormItem>
                <FormLabel className="text-sm font-light text-[#555555]">
                  Email Address
                </FormLabel>
                <div className="flex items-center justify-between bg-[#fbfdfe] rounded-md border border-input">
                  <FormControl>
                    <Input
                      placeholder="example@ad.com"
                      {...form.register("email")}
                      className="bg-transparent border-none outline-none shadow-none focus-visible:ring-0"
                    />
                  </FormControl>
                  <div
                    className={`p-3 bg-bg-color rounded-md ${form.formState.errors.email ? "bg-red-500" : "bg-bg-color"
                      }`}
                  >
                    <AiOutlineMail className="text-white text-2xl" />
                  </div>
                </div>
                <FormMessage className="h-4">
                  {form.formState.errors.email?.message || ""}
                </FormMessage>
              </FormItem>

              {/* PASSWORD INPUT */}
              <FormItem>
                <FormLabel className="text-sm font-light text-[#555555]">
                  Password
                </FormLabel>
                <div className="flex items-center justify-between bg-[#fbfdfe] rounded-md border border-input">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...form.register("password")}
                      className="bg-transparent border-none outline-none shadow-none focus-visible:ring-0"
                    />
                  </FormControl>
                  <div
                    className={`p-3 bg-bg-color rounded-md cursor-pointer ${form.formState.errors.password ? "bg-red-500" : "bg-bg-color"
                      }`}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <AiOutlineUnlock className="text-white text-2xl" />
                    ) : (
                      <AiOutlineLock className="text-white text-2xl" />
                    )}
                  </div>
                </div>
                <FormMessage className="h-4">
                  {form.formState.errors.password?.message || ""}
                </FormMessage>
              </FormItem>

              {/* LOGIN BUTTON */}
              <Button
                type="submit"
                className="whitespace-nowrap w-full py-2 px-10 bg-bg-color text-white font-semibold rounded-lg text-lg"
              >
                Login
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
