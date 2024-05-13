import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

const CreateStartupDialog = () => {
  const [startupData, setStartupData] = useState({
    name: '',
    description: '',
    logo: '',
    industry: '',
    stage: '',
    foundedDate: '',
    website: '',
    socialMedia: '',
  });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setStartupData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/createStartup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(startupData),
      });

      if (response.ok) {
        // Startup created successfully
        // Reset form data
        setStartupData({
          name: '',
          description: '',
          logo: '',
          industry: '',
          stage: '',
          foundedDate: '',
          website: '',
          socialMedia: '',
        });
        
        setOpen(false);
      } else {
        // Handle error case
        console.error('Failed to create startup');
      }
    } catch (error) {
      console.error('Error creating startup:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-sm">
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Startup</DialogTitle>
          <DialogDescription>
            Enter the details of the startup you want to create.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={startupData.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={startupData.description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logo" className="text-right">
                Logo URL
              </Label>
              <Input
                id="logo"
                value={startupData.logo}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="industry" className="text-right">
                Industry
              </Label>
              <Input
                id="industry"
                value={startupData.industry}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stage" className="text-right">
                Stage
              </Label>
              <Input
                id="stage"
                value={startupData.stage}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="foundedDate" className="text-right">
                Founded Date
              </Label>
              <Input
                id="foundedDate"
                value={startupData.foundedDate}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                id="website"
                value={startupData.website}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="socialMedia" className="text-right">
                Social Media
              </Label>
              <Input
                id="socialMedia"
                value={startupData.socialMedia}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStartupDialog;
