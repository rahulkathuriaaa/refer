// @ts-nocheck
"use client";
import React, { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";

const SubmitIssue = () => {
  return (
    <>
      <iframe
        data-tally-src="https://tally.so/embed/wg5rDD"
        loading="lazy"
        width="100%"
        height="1080"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        title="Submit Issue"
      ></iframe>
      <Script
        id="tally-js"
        src="https://tally.so/widgets/embed.js"
        onLoad={() => {
          Tally.loadEmbeds();
        }}
      />
    </>
  );
};

export default SubmitIssue;
