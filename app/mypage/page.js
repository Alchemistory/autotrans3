import React from 'react'
import {Input, Checkbox, Link} from "@nextui-org/react";
import {cn} from "@nextui-org/react";

function page() {
  return (
    <>
    <div className="text-3xl font-bold leading-9 text-default-foreground">
      Welcome to Acme 👋
    </div>
    <div className="py-2 text-medium text-default-500">
      Already have an account?
      <Link className="ml-2 text-secondary underline" href="#" size="md">
        Sign In
      </Link>
    </div>
    <form
      className={cn("flex grid grid-cols-12 flex-col gap-4 py-8")}
    >
      <Input
        className="col-span-12  md:col-span-6"
        label="First Name"
        name="first-name"
        placeholder="Type your first name here"
      />

      <Input
        className="col-span-12 md:col-span-6"
        label="Last Name"
        name="last-name"
        placeholder="Type your last name here"
      />

      <Input
        className="col-span-12 md:col-span-6"
        label="Email"
        name="email"
        placeholder="john.doe@gmail.com"
        type="email"
      />

      <Input
        className="col-span-12 md:col-span-6"
        label="Confirm Email"
        name="confirm-email"
        placeholder="john.doe@gmail.com"
        type="email"
      />

      <Input
        className="col-span-12 md:col-span-6"
        label="Password"
        name="password"
        placeholder="*********"
        type="password"
      />

      <Input
        className="col-span-12 md:col-span-6"
        label="Confirm Password"
        name="confirm-password"
        placeholder="*********"
        type="password"
      />

      <Checkbox
        defaultSelected
        className="col-span-12 m-0 p-2 text-left"
        color="secondary"
        name="terms-and-privacy-agreement"
        size="md"
      >
        I read and agree with the
        <Link className="mx-1 text-secondary underline" href="#" size="md">
          Terms
        </Link>
        <span>and</span>
        <Link className="ml-1 text-secondary underline" href="#" size="md">
          Privacy Policy
        </Link>
        .
      </Checkbox>
    </form>
  </>
  )
}

export default page