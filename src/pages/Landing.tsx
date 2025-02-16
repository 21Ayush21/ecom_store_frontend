import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
      <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-rubik">
          Your MarketPlace for High Quality{" "}
          <span className="text-purple-500">Goods</span>
        </h1>

        <p className="mt-6 text-lg max-w-prose text-muted-foreground font-lato">
          Welcome to _ Every product on our platform is verified by our team to
          ensure our highest quality standards.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link
            to="/home"
            className={buttonVariants({
              className: "bg-purple-500 hover:bg-purple-700",
            })}
          >
            Browse Trending
          </Link>
          <Button variant="ghost">Our quality promise &rarr; </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
