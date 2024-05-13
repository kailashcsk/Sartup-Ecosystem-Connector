"use client";
import React from 'react';

import {
  ChevronLeft,
  ChevronRight,
  Copy,
  File,
  ListFilter,
  MoreVertical,
  Share,
  Link2,
  Plus,
  Heart,
  Share2,
  GitCommitVerticalIcon,
  MessageCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { use, useEffect, useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';
import { saveAs } from 'file-saver';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Label } from "@/components/ui/label";
import { currentUser } from '@clerk/nextjs';
import { Tooltip } from '@radix-ui/react-tooltip';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const Dashboard = () => {
  const USERS_PER_PAGE = 10;

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [startups, setStartups] = useState([]);
  const [page, setPage] = useState(1);
  const [totalFunding, setTotalFunding] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState(['Seed', 'Series A', 'Series B', 'Series C']);
  const [selectedStartup, setSelectedStartup]: [any, any] = useState(null);
  const [startupData, setStartupData] = useState({
    name: '',
    description: '',
    logo: '',
    industry: '',
    stage: '',
    foundedDate: '',
    website: '',
    socialMedia: ''
  });
  const [recentFunds, setRecentFunds] = useState({
    amount: 0,
    valuation: 0
  });
  const [likedPosts, setLikedPosts] = useState([]);

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentInput, setCommentInput] = useState('');

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (id) => {
    setIsCopied(id);
    setTimeout(() => setIsCopied(null), 2000);
  };

  useEffect(() => {
    (async () => {
      const user = await fetch('/api/fetchUserData');
      let userData = await user.json();
      setUser(userData.data || {});

      const users = await fetch('/api/fetchUser');
      userData = await users.json();
      setUsers(userData.data || []);

      const startups = await fetch('/api/fetchUserStartups?id=1');
      const startupData = await startups.json();
      setStartups(startupData.data || []);

      const fundingRounds = await fetch('/api/fetchUsersFundingRounds');
      const { data: fundingData } = await fundingRounds.json();

      setRecentFunds(fundingData[fundingData.length - 1]);
      const totalFunding = fundingData.reduce((total: number, fund: { amount: number }) => total + fund.amount, 0);
      setTotalFunding(totalFunding || 0);

      const userFeeds = await fetch('/api/fetchUsersFeeds');
      const { data } = await userFeeds.json();
      const { feedRecommendations, recommendedPosts } = data;
      recommendedPosts.forEach((post) => {
        const storedComments = localStorage.getItem(`post-${post.id}-comments`) || "[]";
        post.comments = JSON.parse(storedComments) || [];
      });

      setPosts(recommendedPosts);

      const storedLikedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
      setLikedPosts(storedLikedPosts);

    })()
  }, [])

  const formatFunding = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    } else {
      return `$${amount.toLocaleString()}`;
    }
  };

  const handleFilterChange = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const filteredStartups = useMemo(() => {
    return startups.filter((startup: any) => selectedFilters.includes(startup.stage));
  }, [startups, selectedFilters]);

  const showStartup = async (id: number) => {
    const startup = await fetch(`/api/fetchStartup?id=${id}`);
    const data = await startup.json();
    setSelectedStartup(data.data);
  }

  const handleCommentClick = (post) => {
    if (selectedPost === post) {
      setSelectedPost(null);
    } else {
      setSelectedPost(post);
    }
  };

  const handleCommentSubmit = (post) => {
    const newComment = {
      content: commentInput,
      author: user.name,
      profileImage: user.profileImage,
      createdAt: new Date().toISOString(),
    };

    const updatedPost = {
      ...post,
      comments: [...post.comments, newComment],
    };

    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === post.id ? updatedPost : p))
    );

    localStorage.setItem(`post-${post.id}-comments`, JSON.stringify(updatedPost.comments));

    setCommentInput('');
    setSelectedPost(updatedPost);
  };

  const handleEmojiClick = (emoji) => {
    setCommentInput((prevInput) => prevInput + emoji);
  };


  const fetchCommentRecommendation = async (post) => {
    try {
      const response = await fetch('/api/fetchCommentRecommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postDescription: post.content,
          author: post.author.name,
          location: post.location
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comment recommendation');
      }

      const data = await response.json();
      const recommendedComment = data.recommendation;
      setCommentInput(recommendedComment);
    } catch (error) {
      console.error('Error fetching comment recommendation:', error);
    }
  };

  const handleHeartClick = (post) => {
    const postId = post.id;
    if (likedPosts.includes(postId)) {
      // Remove the post ID from liked posts if already liked
      const updatedLikedPosts = likedPosts.filter((id) => id !== postId);
      setLikedPosts(updatedLikedPosts);
      localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
    } else {
      // Add the post ID to liked posts if not already liked
      const updatedLikedPosts = [...likedPosts, postId];
      setLikedPosts(updatedLikedPosts);
      localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
    }
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        {
          posts.map((post: any, index) => (
            <div key={index}>
              <Card>
                <CardHeader className="px-7">
                  <CardTitle className='flex items-center'>
                    <Avatar>
                      <AvatarImage src={post.user.profileImage} alt="Sophia Davis" />
                      <AvatarFallback>SD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col ml-4">
                      <h3 className="text-sm font-semibold">{post.user.name}</h3>
                      <p className="text-xs text-muted-foreground">{post.user.email}</p>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    <p className="mt-4 text-xs">
                      <span className="font-semibold">{post.user.name}</span> posted a new article
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    {post.content}
                  </p>
                  <br />
                  <div className='gap-2 flex items-center justify start'>
                    <Button size="sm" variant="outline" onClick={() => handleHeartClick(post)}>
                      <Heart
                        className={`h-4 w-4 transition-colors duration-300 ${likedPosts.includes(post.id) ? 'text-rose-500 fill-rose-700' : ''
                          }`}
                      />
                    </Button>

                    <Button size="sm" variant="outline" onClick={() => handleCommentClick(post)}>
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <CopyToClipboard text={`http://192.168.141.4:3000/post/${post.id}`} onCopy={() => handleCopy(post.id)}>
                      <Button size="sm" variant="outline">
                        {isCopied === post.id ? 'Copied!' : <Share2 className="h-4 w-4" />}
                      </Button>
                    </CopyToClipboard>

                    <p className='ml-auto text-xs text-slate-300'>
                      {
                        post.createdAt !== post.updatedAt ? 'Edited • ' : ' '
                      }
                      Posted on {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="gap-2 flex items-center justify-start">
                  {selectedPost === post && (
                    <div className='w-full' >
                      <div className="flex items-center space-x-2 w-full">
                        <Input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          className="w-full"
                        />
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                        <Button size="sm" variant="outline" onClick={() => fetchCommentRecommendation(post)}>
                          Ask AI ✨
                        </Button>
                        <Button size="sm" onClick={() => handleCommentSubmit(post)}>
                          Send
                        </Button>
                      </div>

                      <div className="mb-4">
                        {post.comments.map((comment, commentIndex) => (
                          <div key={commentIndex} className="my-6 border px-4 pt-4 border-gray-800 pb-4 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Avatar>
                                <AvatarImage src={comment.profileImage} alt={comment.author} />
                                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-semibold">{comment.author}</p>
                                <p className="text-xs text-muted-foreground">
                                  on {format(new Date(comment.createdAt), 'MMMM d, yyyy')}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm mt-2 ml-12">{comment.content}</p>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          ))
        }
      </div>

      <div>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center bg-muted/50 px-6 py-4">
            <CardTitle className="text-lg font-semibold">Founders with similar interest</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="">
              {
                (users?.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE) || []).map((user: any, index) => (
                  <div key={index}>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={user.profileImage} alt="Sophia Davis" />
                        <AvatarFallback>SD</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 w-full">
                        <div className="flex items-center justify-between w-full">
                          <h3 className="text-sm font-medium">
                            {user?.name}
                          </h3>
                          <Badge className="text-[8px]">
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined on {format(new Date(user.createdAt), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))
              }
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-3">
            <div className="text-sm text-muted-foreground">
              Showing {(page * USERS_PER_PAGE)} of {users.length} results
            </div>
            <Pagination className="ml-auto mr-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => setPage(Math.max(page - 1, 1))}>
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="sr-only">Previous Page</span>
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => setPage(Math.min(page + 1, Math.ceil(users.length / USERS_PER_PAGE)))}>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="sr-only">Next Page</span>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </div>
    </main >
  )
}


export default Dashboard;

const EmojiPicker = ({ onEmojiClick }) => {
  const emojis = [
    '😊', '😂', '😍', '👍', '👏', '🎉', '🔥', '🙌', '🤔', '🙏',
    '😄', '😘', '😎', '😉', '😜', '😁', '😃', '😅', '😆', '😋',
    '😴', '😪', '😫', '😌', '😏', '😒', '😓', '😔', '😖', '😞',
    '😤', '😢', '😭', '😨', '😩', '😰', '😱', '😳', '😵', '😡',
    '😠', '😇', '😈', '👿', '💀', '👹', '👺', '💩', '👻', '👽',
    '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀',
    '😿', '😾', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉',
    '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅',
    '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌',
    '🐚', '🐞', '🐜', '🕷', '🕸', '🐢', '🐍', '🦎', '🦂', '🦀',
    '🦑', '🐙', '🦐', '🐠', '🐟', '🐡', '🐬', '🦈', '🐳', '🐋',
    '🐊', '🐆', '🐅', '🐃', '🐂', '🐄', '🦌', '🐪', '🐫', '🐘',
    '🦏', '🦍', '🐎', '🐖', '🐐', '🐏', '🐑', '🐕', '🐩', '🐈',
    '🐓', '🦃', '🕊', '🐇', '🐁', '🐀', '🐿', '🐾', '🐉', '🐲',
    '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍',
    '🎋', '🍃', '🍂', '🍁', '🍄', '🌾', '💐', '🌷', '🌹', '🥀',
    '🌻', '🌼', '🌸', '🌺', '🌎', '🌍', '🌏', '🌕', '🌖', '🌗',
    '🌘', '🌑', '🌒', '🌓', '🌔', '🌚', '🌝', '🌞', '🌛', '🌜',
    '🌙', '💫', '⭐️', '🌟', '✨', '⚡️', '🔥', '💥', '☄️', '☀️',
    '🌤', '⛅️', '🌥', '☁️', '🌦', '🌈', '☔️', '❄️', '⛄️', '🌬',
    '💨', '🌪', '🌫', '🌊', '💧', '💦', '☂️', '☔️', '⛱', '⚡️',
    '❄️', '🔥', '🌊', '💧', '🌬', '💨', '🌪', '🌫', '☃️', '⛄️',
    '☄️', '🌌', '🎑', '🎇', '🎆', '🌠', '🌄', '🌅', '🌆', '🌇',
    '🌉', '🌃', '🏙', '🌌', '🌠', '🎑', '🎆', '🎇', '🎐', '🎃',
  ];
  const [currentPage, setCurrentPage] = useState(0);
  const emojisPerPage = 30;
  const totalPages = Math.ceil(emojis.length / emojisPerPage);

  const startIndex = currentPage * emojisPerPage;
  const endIndex = startIndex + emojisPerPage;
  const visibleEmojis = emojis.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          😊
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2">
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {visibleEmojis.map((emoji, index) => (
              <Button
                key={index}
                size="sm"
                variant="ghost"
                onClick={() => onEmojiClick(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};