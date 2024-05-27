import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoListApp } from "../target/types/todo_list_app";
import { assert } from "chai";

describe("todo-list-app", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TodoListApp as Program<TodoListApp>;
  const author = program.provider as anchor.AnchorProvider;
  it("can create task", async () => {
    // Add your test here.
    const taskName = "First Task";
    const taskAcc = anchor.web3.Keypair.generate();
    const tx = await program.methods
      .addingTask(taskName)
      .accounts({
        // author: provider.wallet.publicKey,
        task: taskAcc.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([taskAcc])
      .rpc();
    console.log("Your transaction signature", tx);

    const taskAccount = await program.account.task.fetch(taskAcc.publicKey);
    console.log("Your task", taskAccount);

    assert.equal(
      taskAccount.author.toBase58(),
      author.wallet.publicKey.toBase58()
    );
    assert.equal(taskAccount.text, taskName);
    assert.equal(taskAccount.isDone, false);
    assert.ok(taskAccount.createdAt);
    assert.ok(taskAccount.updatedAt);
  });
});
