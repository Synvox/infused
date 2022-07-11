import {
  mdiAccountCircleOutline,
  mdiAccountGroupOutline,
  mdiBellOutline,
  mdiFlashOutline,
  mdiFormatListBulletedType,
  mdiHelp,
  mdiMailboxOpenOutline,
  mdiMessageReplyTextOutline,
  mdiPlus,
  mdiPound,
  mdiTwitter,
} from "@mdi/js";
import { NavLink as RRNavLink, useSearchParams } from "@remix-run/react";
import { StyleSheet } from "infused";
import { CloseButton, FormButton } from "./Button";
import { Composer } from "./Composer";
import { iconOf } from "./Icons";
import { Stack } from "./Stack";

const { styled, keyframes } = StyleSheet();

const TwitterLogo = iconOf(mdiTwitter);
const HashTagIcon = iconOf(mdiPound);
const PeopleIcon = iconOf(mdiAccountGroupOutline);
const BellIcon = iconOf(mdiBellOutline);
const HelpIcon = iconOf(mdiHelp);
const AccountOutline = iconOf(mdiAccountCircleOutline);
const MailIcon = iconOf(mdiMailboxOpenOutline);
const ListsIcon = iconOf(mdiFormatListBulletedType);
const TopicsIcon = iconOf(mdiMessageReplyTextOutline);
const LightningBoltIcon = iconOf(mdiFlashOutline);
const PlusIcon = iconOf(mdiPlus);

export function Nav() {
  const [params] = useSearchParams();
  const newTweet = Boolean(params.get("newTweet"));
  return (
    <>
      <NavContainer>
        <NavLink to="/">
          <TwitterLogo />
        </NavLink>
        <Spacer />
        <NavLink to="?newTweet=true" button>
          <PlusIcon />
        </NavLink>
        <NavSection primary color="#1d9bf0">
          <NavLink to="/explore">
            <HashTagIcon />
          </NavLink>
          <NavLink to="/communities">
            <PeopleIcon />
          </NavLink>
          <NavLink to="/notifications">
            <BellIcon />
          </NavLink>
          <NavLink to="/mail">
            <MailIcon />
          </NavLink>
        </NavSection>
        <NavSection>
          <NavLink to="/lists">
            <ListsIcon />
          </NavLink>
          <NavLink to="/topics">
            <TopicsIcon />
          </NavLink>
          <NavLink to="/moments">
            <LightningBoltIcon />
          </NavLink>
        </NavSection>
        <Spacer />
        <NavLink to="/help">
          <HelpIcon />
        </NavLink>
        <NavSection>
          <NavLink to="/f">
            <AccountOutline />
          </NavLink>
        </NavSection>
      </NavContainer>
      {newTweet && (
        <NewTweet>
          <NewTweetCloseButton action="?" title="Close" />
          <NewTweetModal>
            <Stack>
              <CloseButton action="?" title="close" />
              <Composer />
            </Stack>
          </NewTweetModal>
        </NewTweet>
      )}
    </>
  );
}

export const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 50px;
`;

export const Spacer = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
`;

export const NavLink = styled(RRNavLink)<{
  primary?: boolean;
  button?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  text-decoration: none;
  width: 80%;
  aspect-ratio: 1;
  border-radius: 1000px;
  transition-duration: 250ms;
  margin: 6px;
  border: 2px solid transparent;
  position: relative;
  svg {
    width: 24px;
    height: 24px;
  }
  &:visited {
    color: white;
  }
  &:hover {
    background: #0004;
  }
  &:active {
    background: #0008;
  }
  &:not(.button).active {
    background: white;
    color: #000;
    &.primary {
      color: white;
      background-color: #1d9bf0;
    }
  }
`.classes({
  primary: (p) => p.primary,
  button: (p) => p.button,
});

export const NavSection = styled.div<{ primary?: boolean; color?: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: ${(p) => p.color || "#333"};
  --theme-color: #fff;
  margin-top: 25px;
  margin-bottom: 25px;
  filter: drop-shadow(0px 0px 8px #00000044) drop-shadow(0px 0px 1px #000000cc);
  &::before,
  &::after {
    display: block;
    content: "";
    background-color: ${(p) => p.color || "#333"};
    position: absolute;
    width: 50px;
    height: 50px;
    left: 0;
  }
  &::before {
    bottom: calc(100% - 1px);
    clip-path: path("M0,0C0,25,50,25,50,50,L0,50Z");
  }
  &:not(:last-child)::after {
    top: calc(100% - 1px);
    clip-path: path("M0,0C0,25,50,25,50,50,L0,50Z");
    transform: scaleY(-1);
  }
  &.primary {
    z-index: 1;
  }
  ${NavLink} {
    z-index: 1;
    margin: 6px 10px;
    &:first-child {
      margin-top: -14px;
    }
    &:last-child {
      margin-bottom: -14px;
    }
  }
`.classes({ primary: (p: { primary?: boolean }) => p.primary });

const sideIn = keyframes`
  0% {
    transform: translateY(100px)
  }
  100% {
    transform: translateY(0)
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const NewTweetModal = styled.div`
  width: 100%;
  max-width: 500px;
  background: var(--surface-1);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  padding: 20px;
  --shadow-color: 220 0% 2%;
  --shadow-strength: 25%;
  box-shadow: 0 -1px 2px 0 hsl(var(--shadow-color) /
          calc(var(--shadow-strength) + 2%)),
    0 2px 1px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)),
    0 5px 5px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)),
    0 10px 10px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 4%)),
    0 20px 20px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 5%)),
    0 40px 40px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 7%));
  animation: 0.2s ${sideIn} cubic-bezier(0.33, 1, 0.68, 1);
  z-index: 1;
`;

const NewTweet = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  animation-fill-mode: both;
  justify-content: center;
  align-items: center;
  z-index: 100;
  background-color: #ffffff08;
  backdrop-filter: blur(1px) grayscale(50%);
  display: flex;
  animation: 0.2s ${fadeIn} cubic-bezier(0.33, 1, 0.68, 1);
`;

const NewTweetCloseButton = styled(FormButton)`
  display: block;
  background: transparent;
  border: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  button {
    display: block;
    background: transparent;
    border: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;
