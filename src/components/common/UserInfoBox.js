import React from "react";
import ProfileImage from "./ProfileImage";
import ProfileLink from "./ProfileLink";

function UserInfoBox({ tokenData, onClick, rightContent, bgColor }) {
  return (
    <div
      className={
        "bg-[#EFEFEF] hover:bg-[#C1C1C0] flex items-center cursor-pointer transition duration-300 border-y-[1px] border-border"}
      onClick={onClick}
    >
      <ProfileImage src={tokenData.token.twitterPfpUrl} />

      <ProfileLink
        name={tokenData.token.twitterName}
        username={tokenData.token.twitterUsername}
      />

      <div className="w-1/3 text-[8px] text-center">{rightContent}</div>
    </div>
  );
}

export default UserInfoBox;
