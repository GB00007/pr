export interface Picture {
  alt: string;
  path: string;
  title: string;
  base_url: string;
}

export interface ProfilePicture {
  public_id: string;
}

export interface PagePicture {
  profile: ProfilePicture;
}
