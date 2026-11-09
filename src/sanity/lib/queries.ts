// src/sanity/lib/queries.ts
// Every query that used to be payload.find(...)

// Projects list. The shape matches the old Payload docs (heroImg.url), so the
// <Projects /> component keeps working without changes.
export const projectsQuery = `
  *[_type == "project"] | order(_createdAt desc) {
    "id": _id,
    title,
    "slug": slug.current,
    category,
    year,
    credits,
    "heroImg": { "url": heroImg.asset->url },
    homepageFeatured,
    "createdAt": _createdAt
  }
`;

// One project by slug, with images already flattened to plain URLs
export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    title,
    year,
    credits,
    "heroImg": heroImg.asset->url,
    team[] { label, val },
    consultants[] { label, val },
    slides,
    "verticalImages": verticalImages[].asset->url,
    "horizontalGallery": horizontalGallery[].asset->url
  }
`;

export const projectTitleBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] { title }
`;

// Menu search
export const searchProjectsQuery = `
  *[_type == "project" && title match $term][0...5] {
    "id": "project-" + _id,
    title,
    "type": "PROJECT",
    "slug": "/projects/" + slug.current,
    "img": heroImg.asset->url
  }
`;

// Team page (shape: id, name, img, desc)
export const teamQuery = `
  *[_type == "team"] | order(sortOrder asc, _createdAt asc) {
    "id": _id,
    name,
    "img": image.asset->url,
    desc
  }
`;

export const awardsQuery = `
  *[_type == "award"] | order(year desc) { "id": _id, year, recognition, project }
`;

export const booksQuery = `
  *[_type == "book"] | order(year desc) { "id": _id, year, recognition, project }
`;

// Homepage: the 4 featured projects, in the order chosen in Homepage Settings
export const homepageQuery = `
  *[_type == "homepage"][0] {
    "featuredProjects": featuredProjects[]-> {
      title,
      "slug": slug.current,
      "heroImg": { "url": heroImg.asset->url },
      "heroImgMobile": { "url": heroImgMobile.asset->url },
      homepageFeatured
    }
  }
`;
