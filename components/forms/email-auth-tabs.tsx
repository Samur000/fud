'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailSignupForm } from './email-signup-form';
import { EmailLoginForm } from './email-login-form';

export function EmailAuthTabs() {
  const [activeTab, setActiveTab] = useState('signup');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signup">Регистрация</TabsTrigger>
        <TabsTrigger value="login">Вход</TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait">
        <TabsContent value="signup" className="mt-6">
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <EmailSignupForm />
          </motion.div>
        </TabsContent>

        <TabsContent value="login" className="mt-6">
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <EmailLoginForm />
          </motion.div>
        </TabsContent>
      </AnimatePresence>
    </Tabs>
  );
} 