'use client';
import { useState, useEffect } from 'react';
import Link from "next/link"
import { CircleUser, Menu, Package2, Search } from "lucide-react"
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sun, Moon, Monitor, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTheme } from 'next-themes';
import { DatePickerDemo } from './DatePickerDemo.tsx';

export default function Settings() {

  const router = useRouter();
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', label: 'General' },
    { id: 'profile', label: 'Profile' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
        >
          <div className="grid gap-4 text-sm text-muted-foreground">
            {sections.map(({ id, label }) => (
              <div
                key={id}
                className={`flex items-center space-x-2 cursor-pointer ${activeSection === id ? 'text-primary font-semibold' : ''
                  } px-4 py-2 rounded-lg hover:bg-muted/20 hover:cursor-pointer`}
                onClick={() => handleSectionClick(id)}
              >
                <Label className="hover:cursor-pointer">{label}</Label>
              </div>
            ))}
          </div>
        </nav>

        {
          activeSection === 'general' ? <General /> :
            activeSection === 'profile' ? <Profile /> :
              activeSection === 'advanced' ? <Advanced /> : null

        }

      </div>
    </main>
  )
}


const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    avatar: '',
    dob: null,
  });

  useEffect(() => {
    const storedProfile = localStorage.getItem('profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  const handleChange = (field, value) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [field]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem('profile', JSON.stringify(profile));
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Update your profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={profile.avatar} alt="Avatar" />
                <AvatarFallback>
                  {profile.name
                    .split(' ')
                    .map((word) => word[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button>Change Avatar</Button>
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="website" className="text-sm font-medium">
                Website
              </label>
              <Input
                id="website"
                type="url"
                value={profile.website}
                onChange={(e) => handleChange('website', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="dob" className="text-sm font-medium">
                Date of Birth
              </label>
              <DatePickerDemo
                date={profile.dob}
                onDateChange={(date) => handleChange('dob', date)}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSave}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const General = () => {
  const { theme, setTheme } = useTheme();
  const [visibility, setVisibility] = useState('1st');
  const [notifications, setNotifications] = useState({
    posts: false,
    comments: false,
    follows: false,
    messages: false,
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const storedSettings = localStorage.getItem('generalSettings');
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      setTheme(parsedSettings.theme);
      setVisibility(parsedSettings.visibility);
      setNotifications(parsedSettings.notifications);
    }
  }, []);

  const handleSave = () => {
    const generalSettings = {
      theme,
      visibility,
      notifications,
    };
    localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 1000);
  };


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose your preferred theme.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={(x) => setTheme(x)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light">
              </RadioGroupItem>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark">
              </RadioGroupItem>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system">
              </RadioGroupItem>
              <Monitor className="mr-2 h-4 w-4" />
              <span>System</span>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
          <CardDescription>Set your profile visibility.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={visibility} onValueChange={setVisibility}>
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1st">1st Degree</SelectItem>
              <SelectItem value="2nd">2nd Degree</SelectItem>
              <SelectItem value="3rd">3rd Degree</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Enable notifications for different levels.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="posts"
                checked={notifications.posts}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, posts: checked }))
                }
              />
              <label htmlFor="posts" className="text-sm font-medium leading-none">
                Posts
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="comments"
                checked={notifications.comments}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, comments: checked }))
                }
              />
              <label htmlFor="comments" className="text-sm font-medium leading-none">
                Comments
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="follows"
                checked={notifications.follows}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, follows: checked }))
                }
              />
              <label htmlFor="follows" className="text-sm font-medium leading-none">
                Follows
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="messages"
                checked={notifications.messages}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, messages: checked }))
                }
              />
              <label htmlFor="messages" className="text-sm font-medium leading-none">
                Messages
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSave}>{
            isSaved ? "Saved" : "Save"
          }</Button>
        </CardFooter>
      </Card>


    </div>
  );
};

const Advanced = () => {
  const [text, setText] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'DELETE') {
      console.log('Account deleted');
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>Permanently delete your account and all associated data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            To delete your account, type "DELETE" in the input field below and click the delete button.
          </p>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="mt-4"
          />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={text !== 'DELETE'}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete your account? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteConfirmation('')}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  )
}