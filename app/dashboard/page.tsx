"use client";
import React from 'react';

import {
  ChevronRight,
  Copy,
  File,
  ListFilter,
  MoreVertical,
  Share,
  Link2,
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs"
import { useEffect, useMemo, useState } from "react"
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';
import { saveAs } from 'file-saver';
import { Tooltip } from '@radix-ui/react-tooltip';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import CreateStartupDialog from './CreateStartupDialog';

const Dashboard = () => {
  const USERS_PER_PAGE = 10;

  const [startupTeams, setStartupTeams] = useState([]);
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

  useEffect(() => {
    (async () => {
      const user = await fetch('/api/fetchUserData');
      const userData = await user.json();
      setUser(userData.data || {});

      const startups = await fetch('/api/fetchUserStartups?id=1');
      const startupData = await startups.json();
      setStartups(startupData.data || []);

      const startupTeams = await fetch('/api/fetchUserStartupTeams');
      const startupTeamsData = await startupTeams.json();
      setStartupTeams(startupTeamsData.data || []);




      const fundingRounds = await fetch('/api/fetchUsersFundingRounds');
      const { data: fundingData } = await fundingRounds.json();

      setRecentFunds(fundingData[fundingData.length - 1] || {});
      const totalFunding = fundingData.reduce((total: number, fund: { amount: number }) => total + fund.amount, 0);
      setTotalFunding(totalFunding || 0);
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

  const handleExportCSV = () => {
    // Prepare the CSV data
    const csvData = filteredStartups.map((startup: any) => ({
      id: startup.id,
      name: startup.name,
      description: startup.description,
      logo: startup.logo,
      industry: startup.industry,
      stage: startup.stage,
      website: startup.website,
      foundedDate: format(new Date(startup.foundedDate), 'yyyy-MM-dd'),
      socialMedia: startup.socialMedia,
      founderId: startup.founderId
    }));

    // Generate the CSV file and trigger the download
    return csvData;
  };

  const handleExportJSON = () => {
    // Generate the JSON file and trigger the download
    const jsonData = JSON.stringify(filteredStartups, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    // TODO: Give meaningful name to the file
    saveAs(blob, 'startups.json');
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 col-span-3">
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
          <Card className="sm:col-span-2">
            <CardHeader className="pb-3">

              <CardTitle>Welcome, {user.name || "Founder"}!</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Let&apos;s help you manage your startup, track progress, and achieve your goals. Access resources, connect with mentors, and grow your network.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center gap-4">
              <Button>Edit Startup Profile</Button>
              <Link href='/resources' variant="outline">Access Resources</Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Funded</CardDescription>
              <CardTitle className="text-4xl">{formatFunding(totalFunding)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {formatFunding(recentFunds.amount)} from last round
              </div>
            </CardContent>
            <CardFooter>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Progress
                    className='cursor-pointer'
                    value={(recentFunds.amount / recentFunds.valuation) * 100} aria-label="valuation" />
                </TooltipTrigger>
                <TooltipContent side="right">{formatFunding(recentFunds.valuation)} in valuation</TooltipContent>
              </Tooltip>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Teams</CardDescription>
              <CardTitle className="text-4xl">{startupTeams.length}x</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Roles: {
                  startupTeams.map((team: any, index: number) => <Badge variant="outline" key={index} className='ml-2'>{team.role}</Badge>)}
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="week">
          <div className="flex items-center">
           <CreateStartupDialog />
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-sm"
                  >
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={selectedFilters.includes('Seed')}
                    onCheckedChange={() => handleFilterChange('Seed')}
                  >
                    Seed
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedFilters.includes('Series A')}
                    onCheckedChange={() => handleFilterChange('Series A')}
                  >
                    Series A
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedFilters.includes('Series B')}
                    onCheckedChange={() => handleFilterChange('Series B')}
                  >
                    Series B
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedFilters.includes('Series C')}
                    onCheckedChange={() => handleFilterChange('Series C')}
                  >
                    Series C
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-sm"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={handleExportJSON}>
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    {/** Give meaningful name for file */}
                    <CSVLink data={handleExportCSV()} filename="startups.csv">
                      Export as CSV
                    </CSVLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <TabsContent value="week">
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Startups</CardTitle>
                <CardDescription>
                  Recent startups that you founded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Startup Name</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Industry
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Stage
                      </TableHead>

                      <TableHead className="hidden md:table-cell">
                        Founded Date
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      filteredStartups.map((startup: any, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="font-medium">{startup.name}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              {startup.website}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {startup.industry}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="outline">
                              {startup.stage}
                            </Badge>
                          </TableCell>

                          <TableCell className="hidden md:table-cell">
                            {format(new Date(startup.foundedDate), 'yyyy-MM-dd')}
                          </TableCell>
                          <TableCell className="text-right flex w-full items-center justify-between">

                            <Drawer>
                              <DrawerTrigger asChild>
                                <Button variant="outline" onClick={() => showStartup(startup.id)} >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </DrawerTrigger>
                              {selectedStartup && (
                                <DrawerContent className="w-full max-h-screen t-10">
                                  <div className="mx-auto w-full max-w overflow-auto ">
                                    <div className="p-4 pb-0">
                                      <Card className="overflow-auto h-full">
                                        <CardHeader className="flex flex-row items-start bg-muted/50">
                                          <div className="grid gap-0.5">
                                            <CardTitle className="group flex flex-col items-start text-lg">
                                              <span className="text-xs text-neutral-500">Startup Name:</span>
                                              <div className="w-full font-semibold flex items-center">
                                                <span>{selectedStartup?.name}</span>
                                                <Button
                                                  size="icon"
                                                  variant="outline"
                                                  className="ml-2 flex h-6 w-6 opacity-100 transition-opacity group-hover:opacity-90"
                                                >
                                                  <Copy className="h-3 w-3" />
                                                  <span className="sr-only">Copy Startup Name</span>
                                                </Button>
                                              </div>
                                            </CardTitle>
                                            <CardDescription>
                                              Founded Date:{" "}
                                              {format(new Date(selectedStartup?.foundedDate), "yyyy-MM-dd")}
                                            </CardDescription>
                                          </div>
                                          <div className="ml-auto flex items-center gap-1">
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="outline" className="h-8 w-8">
                                                  <MoreVertical className="h-3.5 w-3.5" />
                                                  <span className="sr-only">More</span>
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Export</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Archive</DropdownMenuItem>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </div>
                                        </CardHeader>
                                        <CardContent className="p-6 text-sm">
                                          <div className="grid gap-3">
                                            <div className="font-semibold">Startup Details</div>
                                            <ul className="grid gap-3">
                                              <li className="flex items-center justify-between">
                                                <span className="text-muted-foreground">Industry</span>
                                                <span>{selectedStartup?.industry}</span>
                                              </li>
                                              <li className="flex items-center justify-between">
                                                <span className="text-muted-foreground">Stage</span>
                                                <span>{selectedStartup?.stage}</span>
                                              </li>
                                            </ul>
                                            <Separator className="my-2" />
                                            <ul className="grid gap-3">
                                              <li className="flex items-center justify-between">
                                                <span className="text-muted-foreground">Total Funding</span>
                                                <span>
                                                  $
                                                  {selectedStartup?.funding.reduce(
                                                    (total: number, fund: { amount: number }) => total + fund.amount,
                                                    0
                                                  )}
                                                </span>
                                              </li>
                                              <li className="flex items-center justify-between">
                                                <span className="text-muted-foreground">Valuation</span>
                                                <span>
                                                  $
                                                  {selectedStartup?.funding[0]?.valuation.toLocaleString()}
                                                </span>
                                              </li>
                                              <li className="flex items-center justify-between font-semibold">
                                                <span className="text-muted-foreground">Revenue (YTD)</span>
                                                <span>$250,000</span>
                                              </li>
                                            </ul>
                                          </div>
                                          <Separator className="my-4" />
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-3">
                                              <div className="font-semibold">Founder Information</div>
                                              <address className="grid gap-0.5 not-italic text-muted-foreground">
                                                <span>{selectedStartup?.founder.name}</span>
                                                <span>{selectedStartup?.founder.email}</span>
                                              </address>
                                            </div>
                                            <div className="grid auto-rows-max gap-3">
                                              <div className="font-semibold">Investor Information</div>
                                              <div className="text-muted-foreground">
                                                {selectedStartup?.funding.map((fund: { investorId: number }) => fund.investorId).join(", ")}
                                              </div>
                                            </div>
                                          </div>
                                          <Separator className="my-4" />
                                          <div className="grid gap-3">
                                            <div className="font-semibold">Team Information</div>
                                            <dl className="grid gap-3">
                                              <div className="flex items-center justify-between">
                                                <dt className="text-muted-foreground">Team Size</dt>
                                                <dd>{selectedStartup?.team.length}</dd>
                                              </div>
                                              <div className="flex items-center justify-between">
                                                <dt className="text-muted-foreground">Key Roles</dt>
                                                <dd>{selectedStartup?.team.map((member: { role: string }) => member.role).join(", ")}</dd>
                                              </div>
                                            </dl>
                                          </div>
                                          <Separator className="my-4" />
                                          <div className="grid gap-3">
                                            <div className="font-semibold">Product Information</div>
                                            <dl className="grid gap-3">
                                              <div className="flex items-center justify-between">
                                                <dt className="flex items-center gap-1 text-muted-foreground">
                                                  <Link2 className="h-4 w-4" /> Website
                                                </dt>
                                                <dd>
                                                  <a
                                                    href={selectedStartup?.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  >
                                                    {selectedStartup?.website}
                                                  </a>
                                                </dd>
                                              </div>
                                              <div className="flex items-center justify-between">
                                                <dt className="flex items-center gap-1 text-muted-foreground">
                                                  <Share className="h-4 w-4" />{" "}
                                                  {selectedStartup?.socialMedia ? "Social Media" : "No Social Media"}
                                                </dt>
                                                <dd>
                                                  {selectedStartup?.socialMedia && (
                                                    <a
                                                      href={selectedStartup?.socialMedia}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                    >
                                                      {selectedStartup?.socialMedia}
                                                    </a>
                                                  )}
                                                </dd>
                                              </div>
                                            </dl>
                                          </div>
                                        </CardContent>
                                        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                                          <div className="text-xs text-muted-foreground">
                                            Updated <time>{format(new Date(selectedStartup?.updatedAt), "yyyy-MM-dd")}</time>
                                          </div>
                                        </CardFooter>
                                      </Card>
                                    </div>
                                    <br />
                                  </div>
                                </DrawerContent>
                              )}
                            </Drawer>


                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

    </main>
  )
}


export default Dashboard;