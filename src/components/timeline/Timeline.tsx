import { Suspense, useRef, useState } from "react";
import { MdCoffee } from "react-icons/md";
import { Await, Link, useParams } from "react-router-dom";
import CommitButtonList from "./CommitButtonList";
import * as GithubApi from "../../api/GithubApi";
import { GitRepo, TimelineParams } from "../../api/types";
import React from "react";

export default function Timeline() {
  const repoInfo = useParams() as TimelineParams;

  const [repoData, setRepoData] = useState(GithubApi.getCachedRepo(repoInfo));
  const [count, setCount] = useState<number>(0);
  // /**
  //  * @deprecated
  //  */
  // function toggleZoom(i: string) {
  //   if (!mouseOver) {
  //     setTimeout(() => {
  //       const timeline = document.getElementById("timeline");
  //       const el = document.getElementById(`${i}_commit`);
  //       if (el && timeline) {
  //         target.current = el.offsetLeft - window.innerWidth / 2 + el.getBoundingClientRect().width / 2;
  //       }
  //     }, 150);
  //   }
  // }

  async function refreshRepo() {
    GithubApi.clearCache(repoInfo);
    setCount(0);
    setRepoData(GithubApi.initRepo(repoInfo));
  }

  return (
    <div className="h-screen flex flex-col ">

      <div className="text-center text-white font-mono text-2xl xl:-mt-10 md:pt-16 sm:mt-0 relative flex flex-wrap w-full justify-between align-baseline">
        <div className="md:order-2">
          Showing&nbsp;
          <span className="text-[#58a6ff]">
            <Suspense fallback={<p className="mx-auto font-mono text-white text-xl">...</p>}>
              <Await resolve={repoData}>{(data: GitRepo) => count || data.commits.length}</Await>
            </Suspense>
          </span>
          &nbsp;commits from&nbsp;
          <a className="text-[#58a6ff]" href={`https://github.com/${repoInfo.repoOwner}/${repoInfo.repoName}`} target="_blank">
            {repoInfo.repoOwner}/{repoInfo.repoName}
          </a>
        </div>
        <button className="button mx-3 text-lg order-1 my-2 md:my-0" onClick={() => refreshRepo()}>
          Refetch repo
        </button>

        <button className="button mx-3 text-lg  md:order-3 my-2 md:my-0">Fetch from date</button>
      </div>


      <Suspense fallback={<p className="mx-auto font-mono text-white text-xl">Loading information about repository...</p>}>
        <Await resolve={repoData} errorElement={<p>Error loading repo data!</p>}>
          {(data: GitRepo) => <CommitButtonList setCount={setCount} repo={data}></CommitButtonList>}
        </Await>
      </Suspense>
    </div>
  );
}