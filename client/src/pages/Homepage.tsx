import { useNavigate } from "react-router-dom";
import { Routes } from "@app/router/rooter";
import Layout from "@app/components/Layout";
import ReviewCard from "@app/components/ReviewCard";
import { useTranslation } from "react-i18next";
import { TagCloud } from "react-tagcloud";

const Homepage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate(Routes.auth);
  };

  const mockTags = [
    { value: "photo", count: 25 },
    { value: "movie", count: 18 },
    { value: "books", count: 38 },
    { value: "animals", count: 30 },
    { value: "sport", count: 28 },
    { value: "anime", count: 25 },
    { value: "culture", count: 33 },
    { value: "foods", count: 20 },
    { value: "history", count: 22 },
    { value: "healthy", count: 7 },
    { value: "gaming", count: 25 },
    { value: "nature", count: 15 },
    { value: "cities", count: 17 },
    { value: "programming", count: 27 },
    { value: "fashion", count: 30 },
    { value: "science", count: 15 },
    { value: "cars", count: 30 },
    { value: "tech", count: 11 },
  ];

  const customRenderer = (tag: any, size: any, color: any) => (
    <span
      key={tag.value}
      style={{
        animation: "blinker 3s linear infinite",
        animationDelay: `${Math.random() * 2}s`,
        fontSize: `${size / 2}em`,
        margin: "3px",
        padding: "3px",
        display: "inline-block",
        color: "#0483B6",
      }}
    >
      {tag.value}
    </span>
  );

  return (
    <Layout>
      <div className="flex h-full w-full flex-col px-20 py-16 dark:bg-[#1B1B1B]">
        <div className="flex items-start text-2xl dark:text-white">
          {t("Homepage.popularReviews")}
        </div>
        <div className="mt-6 flex justify-between">
          {Array.from({ length: 4 }).map((item: any, i) => (
            <div key={i}>
              <ReviewCard />
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-start text-2xl dark:text-white">
          {t("Homepage.recentlyAdded")}
        </div>
        <div className="mt-6 flex justify-between">
          {Array.from({ length: 4 }).map((item: any, i) => (
            <div key={i}>
              <ReviewCard />
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-start text-2xl dark:text-white">
          {t("Homepage.popularTags")}
        </div>
        <div className="mt-6">
          <TagCloud
            minSize={2}
            maxSize={5}
            tags={mockTags}
            renderer={customRenderer}
            className="cursor-pointer"
            onClick={(tag: any) => alert(`'${tag.value}' was selected!`)}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Homepage;