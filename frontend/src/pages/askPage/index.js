import React from "react";

import RenderPost from "../../components/RenderPost";
import { BaseApi } from "../../constants/constant";

export default function AskPage() {
  return (
      <RenderPost apiLink={`${BaseApi}/post/ask`}/>
  );
}
