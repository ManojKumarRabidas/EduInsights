import "../App.css";

export default function UserManual(){
    return(
        <div>
            <div className="mx-5 mb-5">
                <h5 className="text-center"> <strong>User Manual</strong></h5>
                <hr />
                <div> Lorem ipsum dolor sit amet consectetur adipisicing elit. Id a ratione ullam, atque obcaecati rerum architecto maxime provident incidunt eaque ex repellendus explicabo eos repudiandae sequi voluptatum modi. Ratione, animi?
                Expedita, vitae deserunt! Velit aspernatur voluptatibus cupiditate ipsa. Iste cum nisi ullam nostrum quidem, rerum repudiandae praesentium, temporibus repellat molestias consectetur similique corporis hic dolor optio atque unde dolorum ad?
                Perspiciatis cupiditate inventore magnam est explicabo amet velit assumenda, totam nulla hic illum alias modi esse ullam!<br /><br /> Sapiente eaque tempore dolore atque obcaecati nostrum aspernatur dicta, similique ad dignissimos vel?
                Non, enim rem blanditiis maiores quibusdam distinctio minima harum tempora ducimus quia ex ipsa, maxime architecto, hic ullam ipsum error culpa veritatis et repellendus! Fugit veniam perferendis aut iste alias!
                Ut porro, expedita voluptatibus ea accusamus perspiciatis ullam enim tempora reprehenderit esse deleniti laboriosam sint sed, repellat quos voluptate? Unde voluptatibus autem architecto distinctio, quae temporibus fuga repudiandae quia tenetur.
                Accusamus eaque labore nisi vero qui quasi commodi dolores praesentium quia mollitia, cumque iusto optio consectetur expedita exercitationem molestiae! Qui quaerat debitis nam ad quo earum aliquam laudantium ipsam quibusdam!
                Nulla libero minima assumenda eos sequi, labore magnam quos, tempore cumque aut unde recusandae, inventore atque corrupti beatae hic error reprehenderit natus eveniet in voluptates quaerat! Reiciendis eum labore doloremque?
                Cupiditate, commodi. <br /><br />In provident veniam expedita? Vero quidem beatae, optio, autem ea similique eligendi commodi, repudiandae consequatur pariatur porro sit! Dolore alias sequi doloribus quis earum officia mollitia illum dolorem!
                Dolorum facere corrupti ab provident placeat quibusdam beatae nisi voluptas praesentium rerum, totam vel vero? Dolorum placeat nesciunt sapiente neque asperiores accusamus deleniti ipsa nobis rem beatae, quo animi ipsum.
                Ad, sequi illo quae aliquam consequatur labore sed dolorem voluptas reiciendis inventore praesentium. Nihil iusto consequuntur possimus, minima perspiciatis a voluptate corrupti ex rem ipsa consequatur amet, delectus quisquam sequi. </div>
            </div>
            <hr />
            <div className="mx-5 mb-5">
                <h5 className="text-center"><strong>Upcoming Updates</strong></h5>
                <hr />
                <div>
                    <div>
                        <span><strong>1. Notification:</strong>  In the sidebar beside the "Pending Verifications" there will be a number which count the number of pending verifications. It helps the admin and support to know if there is any pending verification or not without visiting the window. <br /></span>
                        <span className="mx-3 d-block">** If possible we will try to add the same type notification for "All Teachers' Feedbacks" & "All Students' Feedbacks".</span>
                    </div>
                    <hr />
                    <div>
                        <span><strong>2. Average 'Strength' & 'Area of Improvement' in feedback lists: </strong> The average of the numaric feedback was already there in the feedback list window. In that list on top of all "Strengths" & "Area of Improvements" column, There will be a button on click of which a pop up will be opened, where in a tabular form the count of "Strengths" or "Area of Improvement" will be showed as per table data, same as Dashboard. <br /> </span>
                    </div>
                    <hr />
                    <div>
                        <span><strong>3. Reason of rejection: </strong> When admin or support will reject a user from "Pending Verifications", he/she have to write a reason of rejection. When the rejected user will try to log in he/she can see the reason of his rejection. Also in the user list there will be a button for each rejected users on click of which a pop up will open where the reason of rejection will be written also the date of rejection, Who reject the user etc.  <br /> </span>
                    </div>
                    <hr />
                    <div>
                        <span><strong>4. Re-approve rejected users: </strong> In the user list there will be a button for each rejected users on click of which a pop up will open where also with the rejection details, Delete the user from DB permanently or re-approve the user such options will be present.  <br /> </span>
                    </div>
                    <hr />
                    <div>
                        <span><strong>5. Update registration details for the rejected users: </strong> The users who will be rejected by the admin will get a option to update his/her registration details and resubmit his details. Then the updated details will be show in pending verification again with such information that this user is a rejected user who has update his/her registration details.  <br /> </span>
                    </div>
                    <hr />
                    <div>
                        <span><strong>6. Customizable comparison graph in dashboard: </strong> There will be a graph in dashboard which will contain mainly two feature:  <br /> </span>
                        <span className="mx-3 d-block">a.	Select parameter and number of months/semesters you want to compare. And you will get a graphical view where all the average of the selested parameter for each month or semester will be show in a comparision view. It will help you to understand the growth rate for any specific parameter for past selected time periods.</span>
                        <span className="mx-3 d-block">b.	This comparision graph will be available in both line chart and bar chart as selected by the user.</span>
                    </div>
                    {/* <hr />
                    <div>
                        <span><strong>7. Dynamic feedback parameters: </strong> There will be a section for create, update, delete parameters for feedback form. All the parameter will be dynamic and admin can add or remove or edit any parameter and it's options as per his/her requrement. Also admin can set the input box type as per requrement like dropdown, input box, multiselect input box, toggle etc. <br /> </span>
                    </div> */}
                    <hr />
                    <div>
                        <span><strong>7. Edit profile: </strong> In the profile there will a option of 'Edit Info'. User can update his/her information from here. But once a user update his/her information his information will again go to the pending verification section and after admin's verification, he/she can continue his/her jobs.<br /> </span>
                    </div>
                </div>
            </div>
            <hr />
            <div className="mx-5 mb-5">
                <h5 className="text-center"><strong>Upcoming Features</strong></h5>
                <hr />
                <div>
                    <div>
                        <span><strong>1. Search by 'Strength' & other parameters:</strong>  This is for searching the students only. In this feature college authority can search a student based on their required quality. For example, in a function college authority need a student who has good public speking quality. The admin/support simply go to this window, Search good public speaking quality, all the students who has that strengths will be shown in a table with all details like who give him feedbacks, count of that feedback etc. And definetly the table data will be shorted from the best student based on feedback to less good student for that searching parameter,  in this example 'Good public speaking quality'. We will use <strong><i>Complex Query </i></strong> to get the result. To achive the goal, one window will be provided to the admin and support which contain: <br /></span>
                        <span className="mx-3 d-block">a.	Search box</span>
                        <span className="mx-3 d-block">b.	Multiselect Strength search box</span>
                        <span className="mx-3 d-block">c.	Multiselect other parameters search box</span>
                        <span className="mx-3 d-block">d.	Filter like</span>
                            <span className="mx-5 d-block">i.	Semester (Multiselect)</span>
                            <span className="mx-5 d-block">ii.	Department (Multiselect)</span>
                        <span className="mx-3 d-block">e.	And a Table which contain:</span>
                            <span className="mx-5 d-block">i.	Name, Department, Semester, reg no of student </span>
                            <span className="mx-5 d-block">ii.	The list of teachers gives him/her such feedbacks</span>
                        <span className="mx-3 d-block">** There will be two types of sorting of table data:</span>
                            <span className="mx-5 d-block">a.    Sort by the number of positive feedbacks where the number of total feedback, semester, teacher is immaterial.</span>
                            <span className="mx-5 d-block">b.    Sort by percentage of positive feedback where number of totals feedbacks, semester and number of teachers all will be considered.</span>
                    </div>
                    <hr />
                    <div>
                        <span><strong>2. Report: </strong>This window will contain the report or suggestion for a teacher or student about his/her next step to be a better one. This content of report or suggestion will be generated by<strong><i> Generative AI </i></strong>  after analysing the feedbacks he/she get. This analysis will be done by default with the last 12 months data of a teacher and all previous data of a student. The feature will be like below. There will be three sections of the report: <br /> </span>
                        <span className="mx-3 d-block">a.	 Areas, which need improvement: Based on feedbacks also with “additional comments” there will be multiple points that on which things the user need to work now to make it better. This result will be generated after analysing all the rating parameters not only “Areas of improvement” parameters. This may farther classify as:</span>
                            <span className="mx-5 d-block">i.	Very weak areas</span>
                            <span className="mx-5 d-block">ii.	Weak areas </span>
                        <span className="mx-3 d-block">b.	Strong areas: Based on feedbacks also with “additional comments” there will be multiple points that are good enough of the user and must be maintain like this. This may include a feature: Points the strengths which became better from the previous feedbacks. This will be done by a comparisons analysis of old and new feedbacks.</span>
                        <span className="mx-3 d-block">c.	Conclusion: The final conclusion in 2 to 3 lines about his growth and future steps he/she should take. </span>
                    </div>
                    <hr />
                    <div>
                        <span><strong>3. Slang words recongnization: </strong>There will be a system which will monitor all the manual inputes like "Strength", "Area of Improvement" & "Additional Comments" and check by algorithms that any one is giving any unwanted input or slang inputs or not. The whole task was done by <strong><i>AI & ML</i></strong> . If there is any that will be informed to EduInsight Admin and also the college admin by a new window. For that there will be a Eduinsight Admin portal or dashboard. The steps of the process will be like below: <br /> </span>
                        <span className="mx-3 d-block">a.	If any student or teacher do such activity College admin or Eduinsight admin will get notified. And that feedback will be stored in pending Feedback area.</span>
                        <span className="mx-3 d-block">b.	If College admin or Eduinsights admin allow that feedback to be submitted only then the feedback will submited.</span>
                        <span className="mx-3 d-block">c.	If the admin thought it is not a submitable feedback the admin either give his/her a warning that will be notified to that user also that will recoded in DB. Or admin can directly block that user in the application.</span>
                        <span className="mx-3 d-block">d.	If the user is an anonymous student then his/her identity will be reveled to admin performe the whole process.</span>
                        <span className="mx-3 d-block">e.	If the user will be blocked then he was merked as rejected user and the reson will be given by admin on the time of blocking. </span>
                    </div>
                    <hr />
                    <div>
                    <span><strong>4. Dynamic feedback parameters: </strong> There will be a section for create, update, delete parameters for feedback form. All the parameter will be dynamic and admin can add or remove or edit any parameter and it's options as per his/her requrement. Also admin can set the input box type as per requrement like dropdown, input box, multiselect input box, toggle etc. <br /> </span>
                    </div>
                </div>
            </div>
            <hr /> 
            <div className="text-center m-3">
                <div>Please feel free to reach us if you have any opinions or features we should include in the application to make it more usefull for you. Mail us on support@eduinsights.in</div>
                <div>&copy; Copyright 2024 by eduinsights.in || All Rights Reserved</div>
            </div>
        </div>
    )
}