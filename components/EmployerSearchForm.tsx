import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Search, Clock } from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Form from "next/form";

export default function EmployerSearchForm() {
  const [query, setQuery] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<
    { keywords: string; dateSearched: string }[]
  >([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("employerRecentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const allSuggestions = [
    "توسعه‌دهنده وب",
    "طراح رابط کاربری (UI)",
    "توسعه‌دهنده فرانت‌اند",
    "توسعه‌دهنده بک‌اند",
    "طراح تجربه کاربری (UX)",
    "توسعه‌دهنده اپلیکیشن موبایل",
    "مهندس نرم‌افزار",
    "توسعه‌دهنده فول‌استک",
    "مدیر پروژه",
    "تحلیلگر داده",
    "مهندس یادگیری ماشین",
    "کارشناس دیجیتال مارکتینگ",
    "متخصص سئو",
    "تولید کننده محتوا",
    "کپی‌رایتر",
    "مدیر شبکه‌های اجتماعی",
    "کارشناس فروش",
    "کارشناس پشتیبانی فنی",
    "مدیر محصول",
    "کارشناس تحقیق و توسعه (R&D)",
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

  const handleBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !relatedTarget.closest(".suggestions-container")) {
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsFocused(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for candidates:", { query, experienceLevel });

    // Prepare the new search entry
    const newSearch = {
      keywords: query,
      dateSearched: Date.now().toString(),
    };

    if (newSearch.keywords.trim() !== "") {
      // Update recent searches with the new entry, limited to the last 5
      const updatedSearches = [
        newSearch,
        ...recentSearches.filter((item) => item.keywords !== query),
      ].slice(0, 5);

      setRecentSearches(updatedSearches);
      localStorage.setItem(
        "employerRecentSearches",
        JSON.stringify(updatedSearches)
      );
    }

    setIsFocused(false);
  };

  return (
    <Form
      action={"/jobs"}
      // onSubmit={handleSearch}
      className='grid md:flex md:gap-4 md:mx-auto'
    >
      <div className='relative'>
        <Input
          className='flex-1 h-14 text-lg pl-4 pr-10 bg-white rounded-lg'
          placeholder='تخصص یا کلمه کلیدی'
          type='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          name='q'
        />
        <Search className='absolute right-4 top-1/2 -translate-y-1/2 w-4' />
        {isFocused && (
          <div
            className='absolute inset-x-0 bg-white shadow-lg rounded-lg z-10 mt-1 suggestions-container'
            onMouseDown={(e) => e.preventDefault()}
          >
            {query ? (
              <ul>
                {filteredSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className='flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition duration-200'
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                  >
                    <Search className='w-5 h-5 ml-2 text-gray-500' />
                    {suggestion}
                  </li>
                ))}
              </ul>
            ) : (
              recentSearches.length > 0 && (
                <ul>
                  <li className='px-4 py-2 text-gray-500 bg-gray-100 text-right'>
                    آخرین جستجوهای شما
                  </li>
                  {recentSearches.map((search, index) => (
                    <li
                      key={index}
                      className='flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition duration-200'
                      onMouseDown={() => handleSuggestionClick(search.keywords)}
                    >
                      <Clock className='w-5 h-5 ml-2 text-gray-500' />
                      {search.keywords}
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        )}
      </div>
      <Select onValueChange={setExperienceLevel}>
        <SelectTrigger className='h-14 text-lg bg-white md:w-[150px]'>
          <SelectValue placeholder='سطح تجربه' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='entry'>تازه کار</SelectItem>
          <SelectItem value='intermediate'>با تجربه</SelectItem>
          <SelectItem value='senior'>ارشد</SelectItem>
          <SelectItem value='expert'>خبره</SelectItem>
        </SelectContent>
      </Select>
      <Button
        type='submit'
        className='h-10 md:h-14 mt-2 md:mt-0 text-lg flex items-center'
      >
        <Search className='h-5 w-5 ml-2' />
        جستجو
      </Button>
    </Form>
  );
}
