import { AppRoute } from "@blazjs/common";
import Container from "typedi";
import { UserRoute } from "./modules/users/user.route";
import { StoryRoute } from "./modules/stories/story.route";
import { EventRoute } from "./modules/events/event.route";
import { IdeaRoute } from "./modules/ideas/idea.route";
import { WebhookRoute } from "./modules/webhooks/webhook.route";
import { SectionRoute } from "./modules/sections/section.route";
import { MetaRoute } from "./modules/meta/meta.route";

const routeClasses = [
  UserRoute,
  StoryRoute,
  EventRoute,
  IdeaRoute,
  WebhookRoute,
  SectionRoute,
  MetaRoute,
];

export const RoutesVer1: AppRoute = {
  version: "v1",
  routes: routeClasses.map((route) => Container.get(route as any)),
};
