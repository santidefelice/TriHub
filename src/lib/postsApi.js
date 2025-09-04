import { supabase } from './supabaseClient';

export async function fetchPosts({ search, sort, authorId, userId } = {}) {
  let query = supabase
    .from('posts')
    .select('*')
    .order(sort === 'popular' ? 'upvotes' : 'created_at', { ascending: false });
  
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }
  if (authorId) {
    query = query.eq('author_id', authorId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  
  // Get upvote status for each post if user is logged in
  if (userId && data.length > 0) {
    const postIds = data.map(post => post.id);
    const { data: upvotes } = await supabase
      .from('upvotes')
      .select('post_id')
      .in('post_id', postIds)
      .eq('user_id', userId);
    
    const upvotedPostIds = new Set(upvotes?.map(upvote => upvote.post_id) || []);
    
    return data.map(post => ({
      ...post,
      has_upvoted: upvotedPostIds.has(post.id)
    }));
  }
  
  return data.map(post => ({
    ...post,
    has_upvoted: false
  }));
}

export async function fetchPostById(id, userId = null) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, comments(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  
  // Check if user has upvoted this post
  let has_upvoted = false;
  if (userId) {
    const { data: upvote } = await supabase
      .from('upvotes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', userId)
      .single();
    has_upvoted = !!upvote;
  }
  
  return {
    ...data,
    has_upvoted
  };
}

export async function createPost({ title, content, image_url }, user) {
  const { data, error } = await supabase.from('posts').insert({ title, content, image_url, author_id: user.id }).select('*').single();
  if (error) throw error;
  return data;
}

export async function updatePost(id, updates) {
  const { data, error } = await supabase.from('posts').update(updates).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleUpvote(postId, userId) {
  const { data, error } = await supabase.rpc('toggle_upvote', { 
    post_id: postId, 
    user_id: userId 
  });
  if (error) throw error;
  return data;
}

export async function addComment(post_id, text, user) {
  const { data, error } = await supabase.from('comments').insert({ post_id, text, author_id: user.id }).select('*').single();
  if (error) throw error;
  return data;
}

