import React, { useState } from "react";
import LocationSelector from "./LocationSelector";
import { Button } from "./ui/button";
import { Search, SearchIcon } from "lucide-react";
import { Input } from "./ui/input";

export default function SearchForm() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Sample suggestion data (can be fetched from an API)
  const allSuggestions = [
    "React Developer",
    "JavaScript Engineer",
    "Python Developer",
    "Frontend Developer",
    "Full Stack Developer",
    "Software Engineer",
    "Backend Developer",
    "UI/UX Designer",
    "Data Scientist",
    "DevOps Engineer",
    "Product Manager",
    "Tech Lead",
  ];

  // Filter suggestions based on the query
  const filteredSuggestions = allSuggestions
    .filter((suggestion) =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 10); // Limit to 10 suggestions

  // Handle focus and blur events
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 100); // Delay to allow click on suggestions
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsFocused(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Your search logic here
    console.log("Searching for:", { query, location });
  };

  return (
    <div className='md:m-auto max-w-4xl space-y-4'>
      <form onSubmit={handleSearch} className='flex flex-col md:flex-row gap-4'>
        <div className='relative w-full'>
          <Input
            className='flex-1 h-14 text-lg px-4 py-3 bg-white rounded-lg'
            placeholder='عنوان، مهارت، اسم شرکت'
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {isFocused && (
            <ul className='absolute inset-x-0 bg-white shadow-lg rounded-lg max-h-60 overflow-auto z-10 mt-1'>
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className='flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition duration-200'
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                >
                  <Search className='w-5 h-5 ml-2 text-gray-500' />{" "}
                  {/* Replace `Icon` with the actual icon you want */}
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <LocationSelector onLocationSelect={setLocation} />
        <Button type='submit' className='h-14 text-lg flex items-center'>
          <Search className='h-5 w-5 ml-2' />
          جستجو
        </Button>
      </form>
    </div>
  );
}
