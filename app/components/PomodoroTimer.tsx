"use client";

//ui components
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import { Inter } from 'next/font/google';
 
   const inter = Inter({ subsets: ['latin'] });

   import {Oswald} from 'next/font/google';
   const oswald = Oswald ({subsets: ['cyrillic', 'latin']});

  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

  import { Input } from "@/components/ui/input"
    import { Label } from "@/components/ui/label"
  
  
  import {Bokor} from 'next/font/google';
    
  const bokorFont = Bokor({
    subsets: ["latin"],
    weight: "400",
    
  });

  import {Pause} from "lucide-react";
  import {Play} from "lucide-react";
  import {Button} from "@/components/ui/button";
    import {TimerReset} from "lucide-react";
    import {toast} from "sonner"
    import {Music} from "lucide-react";
    
    import {
      Menubar,
      MenubarContent,
      MenubarItem,
      MenubarMenu,
      MenubarSeparator,
      MenubarShortcut,
      MenubarTrigger,
    } from "@/components/ui/menubar"
    import { Switch } from "@/components/ui/switch"

    import {
      Sheet,
      SheetContent,
      SheetDescription,
      SheetHeader,
      SheetTitle,
      SheetTrigger,
    } from "@/components/ui/sheet"
    

    import {
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
    } from "@/components/ui/tooltip"
    

    //imports
    import React from 'react'
    import { useState, useEffect, useRef } from 'react';

    

export default function PomodoroTimer() {

  const INITIAL_TIME = 1500; // 25 minutes
  const INITIAL_MODE = 'focus' as const;
  const INITIAL_CUSTOM_TIMES = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

    const [time, setTime] = useState<number>(INITIAL_TIME);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>(INITIAL_MODE);
    const [customTimes, setCustomTimes] = useState<{
        focus: number;
        shortBreak: number;
        longBreak: number;
      }>(INITIAL_CUSTOM_TIMES);

      const [pendingTimes, setPendingTimes] = useState<{
        focus: number;
        shortBreak: number;
        longBreak: number;
      }>({
        focus: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
      });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

   const currentState = () => {
        setIsRunning(prev => !prev);
        }
   
    
    //convert seconds to proper time
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      };


    


      const formatMode = (mode: 'focus' | 'shortBreak' | 'longBreak'): string => {
        switch (mode) {
          case 'focus':
            return 'Focus Mode';
          case 'shortBreak':
            return 'Short Break';
          case 'longBreak':
            return 'Long Break';
          default:
            return 'focus'; 
        }
      };

      const focus_Time = () => {
        if (isRunning) {
            const confirmSwitch = window.confirm("Switching to Focus will reset the timer");
            if (!confirmSwitch) return;
        }
        setMode ('focus');
        setTime (customTimes.focus);
        setIsRunning (false);
      }

      const short_Break = () => {
        if (isRunning) {
          const confirmSwitch = window.confirm("Switching to short Break will reset the timer");
          if (!confirmSwitch) return;}

        setMode ('shortBreak');
        setTime (customTimes.shortBreak);
        setIsRunning (false);
      }

      const long_Break = () => {
        if (isRunning) {
          const confirmSwitch = window.confirm("Switching to long Break will reset the timer");
          if (!confirmSwitch) return;}

        setMode ('longBreak');
        setTime (customTimes.longBreak);
        setIsRunning (false);
      }

      const handleReset = () => {
        
        const confirmSwitch = window.confirm("doing this will cause everything to go back to default setting. proceed?");
          if (!confirmSwitch) return;
        setIsRunning (false);
        setTime (INITIAL_TIME);
        setMode (INITIAL_MODE);
        setCustomTimes (INITIAL_CUSTOM_TIMES);
        setPendingTimes(INITIAL_CUSTOM_TIMES);
        
        
      }



      const handleSubmit = () => {
        setCustomTimes(pendingTimes);
        if (!isRunning) {
          if (mode === 'focus') setTime(pendingTimes.focus);
          else if (mode === 'shortBreak') setTime(pendingTimes.shortBreak);
          else setTime(pendingTimes.longBreak);}
        
        toast ("Changes have been saved");
        
      }

      useEffect(() => {
        if (isRunning && time > 0) {
            intervalRef.current = setInterval (()=>{
                setTime((prev)=> prev-1); 
            }, 1000)
        }
        else if (time === 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current=null;
            }
            new Audio("/end.mp3").play();
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current=null;
            } 
        }; 
      }, [isRunning, time])

      
      const [musicEnabled, setMusicEnabled] = useState<boolean>(false);
      const musicRef = useRef<HTMLAudioElement | null>(null);

      useEffect(() => {
        if (!musicRef.current) {
          musicRef.current = new Audio("/ambient.mp3");
          musicRef.current.loop = true;
        }
        if (isRunning && musicEnabled) {
          musicRef.current.play().catch((e) => toast("music not working", e));
        } else {
          musicRef.current.pause();
        }
        return () => {
          if (musicRef.current) {
            musicRef.current.pause();
          }
        };
      }, [isRunning, musicEnabled]);

      const musicState = () => {
        setMusicEnabled(prev => !prev);
        }
      
        const getInitialDuration = () => {
          if (mode === "focus") return customTimes.focus;
          if (mode === "shortBreak") return customTimes.shortBreak;
           return customTimes.longBreak;
        };
        const initialDuration = getInitialDuration();
        const progress = (time / initialDuration) * 100;

  return (
    <>
        <Menubar className="justify-around mt-30 flex mx-auto w-[40vw]">
          <MenubarMenu >
          <MenubarTrigger onClick={focus_Time}>
                Focus
          </MenubarTrigger>

          <MenubarTrigger onClick={short_Break}>
                Short Break
          </MenubarTrigger>

          <MenubarTrigger onClick={long_Break} >
                Long Break
          </MenubarTrigger>
          </MenubarMenu>
        </Menubar>
        
        <Card >
        
        <svg className="absolute w-[60vw] h-[60vw] min-w-[200px] min-h-[200px] max-w-[500px] max-h-[500px]" viewBox="0 0 100 100">

            
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#DFD0B8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="283"
          strokeDashoffset={(283 * (100 - progress)) / 100}
          transform="rotate(-90 50 50)"
        />

            </svg>
           
            <CardTitle className={`font-semibold`}>{formatMode(mode)}</CardTitle>
            
            <CardContent className={`font-extrabold ${bokorFont.className} flex justify-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl mt-10 mb-6`}>{formatTime(time)} 
            
            </CardContent>
            <CardFooter>
              <div className="block z-10">
              <div className="flex">
              <div className="px-5">
              <Button onClick={currentState} className="px-10">
                  {isRunning ? <Pause/> : <Play/>}
              </Button>
              </div>
              <div>
              <Button onClick={handleReset}><TimerReset/></Button>
              </div>
              <div className="ml-4"><button><Switch onClick={musicState}/><Music/></button></div>
              </div>
              <div className=" mt-10 px-12 mx-auto">
              <Dialog>
              <DialogTrigger asChild className="">
                  <Button>Settings</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                  <DialogHeader>
                      <DialogTitle>
                          Settings
                      </DialogTitle>
                      <DialogDescription>
                          Make changes to the time 
                      </DialogDescription>
                  </DialogHeader>
                  <div className="flex" >
                      <div className="flex">
                      <Label>Focus</Label>
                      <Input className="ml-2 mr-4" type="number" value={pendingTimes.focus/60} onChange={(e)=>{
                          const value = e.target.value;
                          if (value === '') return;
                          setPendingTimes((prev)=>({
                              ...prev,
                              focus: parseInt(value)*60,
                          }))
                      }} min="0" max="120"/>
                      </div>
                      
                      <div className="flex pr-1">
                      <Label className="mr-0">Short Break</Label>
                      <Input className="ml-0" type="number" value={pendingTimes.shortBreak/60} onChange={(e)=>{
                          const value = e.target.value;
                          if (value === '') return;
                          setPendingTimes((prev)=>({
                              ...prev,
                              shortBreak: parseInt(value)*60,
                          }))
                      }} min="1" max="30"/>
                      </div>

                      <div className="flex ">
                      <Label className="mr-0 ml-2">Long Break</Label>
                      <Input className="ml-0" type="number" value={pendingTimes.longBreak/60} onChange={(e)=>{
                          const value = e.target.value;
                          if (value === '') return;
                          setPendingTimes((prev)=>({
                              ...prev,
                              longBreak: parseInt(value)*60,
                          }))
                      }} min="5" max="120"/>
                      </div>
                     


                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
                  </DialogFooter>
              </DialogContent>
              
              </Dialog>
              </div>
              </div>
            </CardFooter>
            </Card>
            
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 mt-10 px-4 w-full max-w-5xl mx-auto">
            <div className="w-full sm:w-auto text-center">
            <Sheet>
              <SheetTrigger className={`${inter.className} text-xl sm:text-2xl`}>What is a Pomodoro Timer</SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="text-center">POMODORO TIMER</SheetTitle>
                  <SheetDescription className={`${inter.className} text-base sm:text-lg text-center mt-6`}>
                  A Pomodoro timer is a time management tool based on the Pomodoro Technique, 
                  which breaks work into focused intervals—usually 25 minutes of work followed by a 5-minute break. 
                  <br/> After four cycles, you take a longer break of 15–30 minutes. <br/>
                  It helps boost productivity, maintain focus, and reduce mental fatigue. <br/>
                  The method was developed by Francesco Cirillo in the late 1980s and is named after the tomato-shaped kitchen timer he used (pomodoro is Italian for tomato).
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <div className="w-full sm:w-auto text-center">
            <Sheet>
              <SheetTrigger className={`${inter.className} text-xl sm:text-2xl`}>Who created this?</SheetTrigger>
              <SheetContent side="top">
                <SheetHeader>
                  <SheetTitle className={`${oswald.className} text-center text-4xl sm:text-xl lg:text-8xl`}>Why do you wanna know? 🤣😏😝</SheetTitle>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          </div>

            
            
        
        
        

        
        
       
    </>
  )
}

