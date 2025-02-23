"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'sonner';

function CreateBudget() {
  const [emojiIcon, setEmojiIcon] = useState('😄');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false); 
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  // State for storing the list of budgets
  const [budgets, setBudgets] = useState([]);

  // Function to fetch all budgets from the backend
  const fetchBudgets = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/budgets');
    setBudgets(response.data); // Set the fetched budgets to the state
  } catch (error) {
    console.error('Error fetching budgets:', error);
  }
};


  // Fetch budgets on page load
  useEffect(() => {
    fetchBudgets();
  }, []);

  // Function to handle budget creation
  const onCreateBudget = async () => {
    try {
      // Send new budget to the backend
      await axios.post('http://localhost:5000/api/budgets', {
        name,
        amount,
        emoji: emojiIcon,
      });
      toast('Budget Created Successfully'); // Show toast after creating the budget

      // Fetch updated budgets after creating the new one
      fetchBudgets();
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error('Failed to create budget');
    }
  };

  return (
    <div>
      <Toaster />
      
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-lg">
            <h2 className="text-3xl">+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Button variant="outline" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                  {emojiIcon}
                </Button>
                <div className="absolute z-10">
                  <EmojiPicker 
                    open={openEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Name</h2>
                  <Input placeholder="eg. Marketing" 
                         onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input 
                    type="number" 
                    placeholder="eg. Amount" 
                    onChange={(e) => setAmount(e.target.value)} />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button 
                disabled={!(name && amount)}
                onClick={onCreateBudget}
                className="mt-5 w-full"
                variant="outline">
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Display the list of budgets */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">Created Budgets</h2>
        <div className="mt-5">
          {budgets.length > 0 ? (
            <ul className="space-y-4">
              {budgets.map((budget) => (
                <li key={budget._id} className="border p-4 rounded-md shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-semibold">{budget.name}</span>
                      <span className="ml-2 text-sm text-gray-500">{budget.emoji}</span>
                    </div>
                    <div>
                      <span className="text-lg font-medium">{budget.amount} USD</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No budgets created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateBudget;
