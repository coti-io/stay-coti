import api from "@/utils/api";
import { queryClient } from "@/utils/query-client";

const DATOCMS_ENDPOINT = "https://graphql.datocms.com/";
const DATOCMS_TOKEN = "4039fd7cd89f4cd288ed0b01e48e84";

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  totalEvents: number;
  totalMembers: number;
  growthRate: number;
  avatar: {
    url: string;
    title: string;
    alt: string;
  };
  createdBy: {
    id: string;
    name: string;
  };
  _createdAt: string;
  _updatedAt: string;
}

export interface Story {
  id: string;
  name: string;
  sapo: string;
  description: string;
  telegram: string;
  linkedin: string;
  twitter: string;
  avatar: {
    url: string;
    title: string;
    alt: string;
  };
  video: {
    url: string;
    title: string;
  };
  _createdAt: string;
  _updatedAt: string;
}

export async function fetchEvents(first: number = 10, skip: number = 0) {
  try {
    const { data } = await api.get("/v1/events?limit=10");
    return {
      specialFirstEvent: data.data.specialFirstEvent as Event[],
      specialSecondEvent: data.data.specialSecondEvent as Event,
      events: data.data.allEvents as Event[],
      total: data.data._allEventsMeta.count as number,
      specialEvents: data.data.specialLastEvent as Event[],
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function fetchCotiEvents(limit: number = 10, skip: number = 0) {
  try {
    const { data } = await api.get(`/v1/events/coti?limit=${limit}`);

    return {
      events: data.data.allEvents as Event[],
      total: data.data._allEventsMeta.count as number,
      cotiEvent: data.data.cotiEvent as Event[],
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function fetchStories(first: number = 10, skip: number = 0) {
  try {
    const { data } = await api.get(`/v1/stories`);

    return {
      stories: data.data.allStories as Story[],
      total: data.data._allStoriesMeta.count as number,
    };
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }
}

interface IdeaCategory {
  id: string;
  name: string;
}

interface Idea {
  id: string;
  name: string;
  description: string;
  category: IdeaCategory;
  upvote: number;
  _publishedAt: string;
}

interface IdeasResponse {
  data: {
    allIdeas: Idea[];
    _allIdeasMeta: {
      count: number;
    };
  };
}

export async function fetchIdeas(
  limit: number = 10,
  skip: number = 0,
  search: string = "",
  categoryId: string = null,
  orderBy: string = "_publishedAt"
): Promise<IdeasResponse> {
  try {
    const { data } = await api.get(
      `/v1/ideas?limit=${limit}&search=${search}&categoryId=${categoryId}&page=${skip}&orderByKey=${orderBy}&orderByValue=DESC`
    );

    return data;
  } catch (error) {
    console.error("Error fetching ideas:", error);
    throw error;
  }
}

export interface Category {
  id: string;
  name: string;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get("/v1/ideas/categories");
  queryClient.setQueryData(["categoriesData"], data.data.allCategories);
  return data.data.allCategories;
}

export async function addIdea(formData: {
  name: string;
  description: string;
  category: string;
}) {
  try {
    const response = await api.post("/v1/ideas/submit", {
      name: formData.name,
      description: formData.description,
      categoryId: formData.category,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating idea:", error);
    throw error;
  }
}

export interface Profile {
  id: number;
  userId: string;
  authorId: string;
  walletAddress: string;
  accessCode: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchProfileData() {
  try {
    const profileResponse = await api.get("/v1/users/profile");
    const ideasResponse = await api.get("/v1/users/ideas");

    return {
      profile: profileResponse.data.data as Profile,
      ideas: ideasResponse.data as IdeasResponse,
    };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error;
  }
}
