# Caching

Caching is implemented using Next.js's extended fetch method with its `cache` property and the `revalidateTag` function.

<aside>
👉

For Example:

In a server action **[getPosts()]** caching made like this:

```tsx
const response = await fetchBlogAPI(
    url(),
    { cache: 'force-cache', next: { tags: [postsCacheTag] } }
)
```

And in a server action **[createPost()]** made revalidating with tags like this:

```tsx
revalidateTag(postsCacheTag)
```

</aside>